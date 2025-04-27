from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get your API key from environment variables
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

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

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Exercise Catalog API'})

if __name__ == '__main__':
    app.run(debug=True)
