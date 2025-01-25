import os
from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from deepface import DeepFace
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow Cross-Origin Resource Sharing (CORS)

# Set up Spotify authentication
SPOTIPY_CLIENT_ID = "ec99bf8383ce4c2e85986bb7a27cdf44"
SPOTIPY_CLIENT_SECRET = "8142ae9a36f64ded82d18d827180bf33"
SPOTIPY_REDIRECT_URI = "http://127.0.0.1:5000/callback"
SCOPE = "user-library-read playlist-read-private"

sp_oauth = SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                         client_secret=SPOTIPY_CLIENT_SECRET,
                         redirect_uri=SPOTIPY_REDIRECT_URI,
                         scope=SCOPE)

app.secret_key = os.urandom(24)  # To use Flask sessions securely

# Route for the homepage (render HTML)
@app.route('/')
def home():
    user_info = None
    if 'access_token' in session:  # Ensure you've saved the access token in the session
        sp = Spotify(auth=session['access_token'])
        user_info = sp.current_user()  # Fetch user info from Spotify

    return render_template('index.html', user_info=user_info)

# Callback route for Spotify authentication
@app.route('/callback')
def spotify_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Exchange the authorization code for an access token
    try:
        token_info = sp_oauth.get_access_token(code)
        access_token = token_info['access_token']

        # Save the access token for later use (e.g., in a session)
        session['access_token'] = access_token
        print("Access token saved in session:", session.get('access_token'))

        # Redirect to the home page (or any route where you want to show results)
        return redirect(url_for('home'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Analyze emotion using DeepFace
@app.route('/analyze', methods=['POST'])
def analyze_emotion():
    if 'image' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save the file temporarily
    file_path = "temp_image.jpg"
    file.save(file_path)

    try:
        # Analyze emotion using DeepFace
        analysis = DeepFace.analyze(img_path=file_path, actions=['emotion'])
        detected_emotion = analysis[0]['dominant_emotion']

        # Fetch Spotify song based on emotion
        song = get_spotify_song(detected_emotion)

        return jsonify({"emotion": detected_emotion, "song": song})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up the temporary image
        if os.path.exists(file_path):
            os.remove(file_path)

# Function to fetch a song based on detected emotion
def get_spotify_song(emotion):
    # Authenticate Spotify API
    sp = Spotify(auth_manager=sp_oauth)

    # Improved emotion-to-genre mapping
    emotion_to_genre = {
        'happy': ['pop', 'dance'],
        'sad': ['acoustic', 'indie'],
        'angry': ['rock', 'metal'],
        'fear': ['classical', 'ambient'],
        'disgust': ['electronic', 'experimental'],
        'surprise': ['jazz', 'blues']
    }

    # Use the mapped genres for the emotion
    genres = emotion_to_genre.get(emotion.lower(), ['pop'])  # Default to 'pop' if emotion isn't found

    song_data = None  # Initialize the song data

    # Search for a playlist or songs in the corresponding genres
    for genre in genres:
        results = sp.search(q=f'genre:{genre}', type='track', limit=1)
        print(f"Search results for {emotion} in genre {genre}: {results}")  # Debug log

        if results['tracks']['items']:
            song_data = results['tracks']['items'][0]
            break  # Stop once we find a song

    if song_data:
        song_name = song_data['name']
        song_url = song_data['external_urls']['spotify']
        return {'song_name': song_name, 'song_url': song_url}
    
    print(f"No song found for emotion: {emotion}")  # Log when no song is found
    return {"song_name": "No song found", "song_url": "#"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
