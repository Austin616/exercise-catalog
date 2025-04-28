from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///favorites.db'  # Use SQLite for now
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define Favorite model
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.String(100), nullable=False)
    exercise_name = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'exercise_id': self.exercise_id,
            'exercise_name': self.exercise_name
        }

# Initialize the database (only needs to run once)
with app.app_context():
    db.create_all()

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

# API to add a favorite
@app.route('/api/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()
    exercise_id = data.get('exercise_id')
    exercise_name = data.get('exercise_name')

    if not exercise_id or not exercise_name:
        return jsonify({'error': 'Missing exercise_id or exercise_name'}), 400

    favorite = Favorite(exercise_id=exercise_id, exercise_name=exercise_name)
    db.session.add(favorite)
    db.session.commit()

    return jsonify(favorite.to_dict()), 201

# API to get all favorites
@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    favorites = Favorite.query.all()
    return jsonify([fav.to_dict() for fav in favorites])

# API to delete a favorite by id
@app.route('/api/favorites/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    favorite = Favorite.query.get(id)
    if not favorite:
        return jsonify({'error': 'Favorite not found'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite deleted'})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)