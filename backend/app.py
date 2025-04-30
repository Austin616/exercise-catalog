from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from authlib.integrations.flask_client import OAuth
import uuid

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

search_cache = {}

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
app.secret_key = os.getenv('SECRET_KEY')

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///favorites.db'  # Use SQLite for now
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define User and Favorite models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.String(100), nullable=False)
    exercise_name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'exercise_id': self.exercise_id,
            'exercise_name': self.exercise_name,
            'user_id': self.user_id,
        }

import json
from sqlalchemy.types import TypeDecorator, TEXT

class JsonEncodedList(TypeDecorator):
    impl = TEXT
    def process_bind_param(self, value, dialect):
        return json.dumps(value)
    def process_result_value(self, value, dialect):
        return json.loads(value)

class Workout(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    exercises = db.Column(JsonEncodedList)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "date": self.date,
            "notes": self.notes,
            "exercises": self.exercises
        }

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# # Initialize the database only if schema is outdated (missing user_id in Favorite)
# import sqlite3

# def check_and_reset_db():
#     db_path = 'favorites.db'
#     conn = sqlite3.connect(db_path)
#     cursor = conn.cursor()

#     # Check if 'user_id' exists in 'favorite' table
#     try:
#         cursor.execute("PRAGMA table_info(favorite);")
#         columns = [col[1] for col in cursor.fetchall()]
#         if 'user_id' not in columns:
#             print("Missing 'user_id' column. Dropping and recreating all tables.")
#             db.drop_all()
#             db.create_all()
#         else:
#             print("'user_id' column exists. No reset needed.")
#     except Exception as e:
#         print("Error checking DB schema:", e)
#     finally:
#         conn.close()

# with app.app_context():
#     check_and_reset_db()

# Get YouTube API key from environment
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

# YouTube Search Endpoint
@app.route('/api/youtube/search')
def youtube_search():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    if query in search_cache:
        return jsonify(search_cache[query])

    if not YOUTUBE_API_KEY:
        return jsonify({'error': 'YouTube API key is not configured'}), 500

    try:
        response = requests.get(
            'https://www.googleapis.com/youtube/v3/search',
            params={
                'part': 'snippet',
                'q': query,
                'type': 'video',
                'key': YOUTUBE_API_KEY,
                'maxResults': 1,
            }
        )
        data = response.json()
        print(json.dumps(data, indent=2))

        if "error" in data:
            return jsonify({'error': data['error']}), 500

        if 'items' not in data or not data['items']:
            return jsonify({'error': 'No videos found'}), 404

        video_id = data['items'][0]['id']['videoId']
        result = {'videoId': video_id}
        search_cache[query] = result
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to fetch YouTube data'}), 500

# Root route
@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Exercise Catalog API'})

# Authentication routes
@app.route('/api/auth/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri, prompt='select_account')

@app.route('/api/auth/callback')
def authorize():
    try:
        token = google.authorize_access_token()
        if not token:
            print("No token returned from Google")
            return jsonify({'error': 'Authorization failed'}), 400

        resp = google.get('https://openidconnect.googleapis.com/v1/userinfo')
        user_info = resp.json()
        print("User Info:", user_info)

        email = user_info.get('email')
        if not email:
            return jsonify({'error': 'No email found in Google profile'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email)
            db.session.add(user)
            db.session.commit()

        login_user(user)
        return redirect('http://localhost:5173/')
    except Exception as e:
        print("Error during OAuth callback:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    return redirect('http://localhost:5173/')

# API to add a favorite
@app.route('/api/favorites', methods=['POST'])
@login_required
def add_favorite():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    exercise_id = data.get('exercise_id')
    exercise_name = data.get('exercise_name')

    if not exercise_id or not exercise_name:
        return jsonify({'error': 'Missing exercise_id or exercise_name'}), 400

    favorite = Favorite(exercise_id=exercise_id, exercise_name=exercise_name, user_id=current_user.id)
    db.session.add(favorite)
    db.session.commit()

    return jsonify(favorite.to_dict()), 201

# API to get all favorites
@app.route('/api/favorites', methods=['GET'])
@login_required
def get_favorites():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401

    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    return jsonify([fav.to_dict() for fav in favorites])

# API to delete a favorite by id
@app.route('/api/favorites/<int:id>', methods=['DELETE'])
@login_required
def delete_favorite(id):
    if not current_user.is_authenticated:
        return jsonify({'error': 'Unauthorized'}), 401

    favorite = Favorite.query.filter_by(id=id, user_id=current_user.id).first()
    if not favorite:
        return jsonify({'error': 'Favorite not found'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite deleted'})

@app.route('/api/workouts', methods=['POST'])
@login_required
def save_workout():
    try:
        data = request.get_json()
        print("Workout POST payload:", data)

        name = data.get('name')
        date = data.get('date')
        notes = data.get('notes')
        exercises = data.get('exercises')

        if not name or not date:
            return jsonify({'error': 'Missing name or date'}), 400

        workout = Workout(
            user_id=current_user.id,
            name=name,
            date=date,
            notes=notes,
            exercises=exercises
        )
        db.session.add(workout)
        db.session.commit()

        return jsonify(workout.to_dict()), 201
    except Exception as e:
        print("🔥 Error saving workout:", str(e))
        return jsonify({'error': 'Server error', 'message': str(e)}), 500
    

@app.route('/api/workouts', methods=['GET'])
@login_required
def get_workouts():
    workouts = Workout.query.filter_by(user_id=current_user.id).all()
    return jsonify([workout.to_dict() for workout in workouts])

@app.route('/api/workouts/<string:id>', methods=['GET'])
@login_required
def get_workout(id):
    workout = Workout.query.filter_by(id=id, user_id=current_user.id).first()
    if not workout:
        return jsonify({'error': 'Workout not found'}), 404
    return jsonify(workout.to_dict())

@app.route('/api/workouts/<string:id>', methods=['DELETE'])
@login_required
def delete_workout(id):
    workout = Workout.query.filter_by(id=id, user_id=current_user.id).first()
    if not workout:
        return jsonify({'error': 'Workout not found'}), 404

    db.session.delete(workout)
    db.session.commit()
    return jsonify({'message': 'Workout deleted'})

@app.route('/api/workouts/<string:id>', methods=['PUT'])
@login_required
def update_workout(id):
    workout = Workout.query.filter_by(id=id, user_id=current_user.id).first()
    if not workout:
        return jsonify({'error': 'Workout not found'}), 404

    data = request.get_json()
    workout.name = data.get('name', workout.name)
    workout.date = data.get('date', workout.date)
    workout.notes = data.get('notes', workout.notes)
    workout.exercises = data.get('exercises', workout.exercises)

    db.session.commit()
    return jsonify(workout.to_dict())

@app.route('/api/current_user')
def current_user_info():
    if current_user.is_authenticated:
        return jsonify({
            'is_authenticated': True,
            'email': current_user.email
        })
    else:
        return jsonify({
            'is_authenticated': False,
            'email': None
        }), 401
    

class CompletedSet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.String(36), db.ForeignKey('workout.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    completed_sets = db.Column(JsonEncodedList)

@app.route('/api/workouts/<string:id>/completed_sets', methods=['GET', 'POST'])
@login_required
def handle_completed_sets(id):
    if request.method == 'GET':
        entry = CompletedSet.query.filter_by(workout_id=id, user_id=current_user.id).first()
        return jsonify({'completedSets': entry.completed_sets if entry else {}})
    else:
        try:
            data = request.get_json()
            print("Received completedSets payload:", data)  # Debug print
            completed = data.get('completedSets', {})

            if not isinstance(completed, dict):
                raise ValueError("Invalid data format: completedSets must be a dictionary")

            entry = CompletedSet.query.filter_by(workout_id=id, user_id=current_user.id).first()
            if entry:
                entry.completed_sets = completed
            else:
                entry = CompletedSet(workout_id=id, user_id=current_user.id, completed_sets=completed)
                db.session.add(entry)
            db.session.commit()
            return jsonify({'message': 'Completed sets saved'})
        except Exception as e:
            print("🔥 Error saving completed sets:", str(e))
            return jsonify({'error': 'Server error', 'message': str(e)}), 500

class ExerciseHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    sets = db.Column(JsonEncodedList, nullable=False)

@app.route('/api/exercise_history', methods=['POST'])
@login_required
def post_exercise_history():
    try:
        data = request.get_json()
        exercise = data.get('exercise')
        sets = data.get('sets', [])
        date = data.get('date')

        if not exercise or not sets or not date:
            return jsonify({'error': 'Missing required fields'}), 400

        history = ExerciseHistory(
            user_id=current_user.id,
            exercise=exercise,
            date=date,
            sets=sets
        )
        db.session.add(history)
        db.session.commit()
        return jsonify({'message': 'History saved'}), 201
    except Exception as e:
        print("🔥 Error posting exercise history:", str(e))
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

@app.route('/api/exercise_history/<string:exercise>', methods=['GET'])
@login_required
def get_exercise_history(exercise):
    try:
        entries = ExerciseHistory.query.filter_by(user_id=current_user.id, exercise=exercise).all()
        return jsonify([
            {
                'exercise': entry.exercise,
                'date': entry.date,
                'sets': entry.sets
            } for entry in entries
        ])
    except Exception as e:
        print("🔥 Error fetching exercise history:", str(e))
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

# New route: POST exercise history for a specific exercise name
@app.route('/api/exercise_history/<string:exercise>', methods=['POST'])
@login_required
def post_exercise_history_with_name(exercise):
    try:
        data = request.get_json()
        sets = data.get('sets', [])
        date = data.get('date')

        if not sets or not date:
            return jsonify({'error': 'Missing sets or date'}), 400

        history = ExerciseHistory(
            user_id=current_user.id,
            exercise=exercise,
            date=date,
            sets=sets
        )
        db.session.add(history)
        db.session.commit()
        return jsonify({'message': 'History saved'}), 201
    except Exception as e:
        print("🔥 Error posting exercise history with name:", str(e))
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)