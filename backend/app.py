from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from authlib.integrations.flask_client import OAuth

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

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

        if 'items' not in data or not data['items']:
            return jsonify({'error': 'No videos found'}), 404

        video_id = data['items'][0]['id']['videoId']
        return jsonify({'videoId': video_id})
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
    
# Run the app
if __name__ == '__main__':
    app.run(debug=True)