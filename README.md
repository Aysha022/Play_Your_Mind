# Play_Your_Mind 🎯
## Basic Details
### Team Name : Hackstone
### Team Members
- Member 1: Raina Susan Ranjith - RIT,Kottayam
- Member 2: Fidha Naisam - RIT, Kottayam
- Member 3: Aysha Naurin - RIT, Kottayam
### Hosted Project Link


### Project Description
Our Project "Play Your Mind" can read your emotions from your face and pour the music that your heart earns for!
It is a project to detect and recognize human emotions based on facial expressions. It aims to analyze emotions like happiness, sadness, anger, and more using facial data.


### The Problem Statement
Ever struggled to figure out if someone’s mad at you or just hungry? Decoding emotions can feel like cracking a secret code!

### The Solution
'Play_Your_Mind' takes the guesswork out of it by using facial expressions to detect emotions like happiness, sadness, or "I-need-coffee." Perfect for making life (and interactions) a little easier!

## Technical Details
### Technologies/Components Used
For Software:
- Languages used : Python
- Frameworks used : Flask
- Libraries used : OpenCV,Deepface,Matplotlib,Numpy,Pandas
- Tools used : Visual Studio Code


### Implementation
For Software : 
The implementation of this project involves combining Flask, DeepFace, and the Spotify API to create a seamless experience where a user's emotions, detected from an image, are linked to a Spotify song recommendation.

1. **Flask Backend**
Purpose: Acts as the backbone of the application, handling routes, API requests, and user sessions.
The homepage (/) serves a web interface built using HTML, where users can interact with the app.

2.**Emotion Analysis with DeepFace**
Users upload an image via the /analyze route.
The image is temporarily saved and analyzed using the DeepFace library to determine the dominant emotion.

3.**Spotify API Integration**
Spotify OAuth is used for secure authentication, ensuring user data is accessed appropriately.
Once authenticated, the app fetches song recommendations based on the detected emotion.
A mapping between emotions and genres (e.g., happy → pop, dance) ensures genre-appropriate song selections.
The Spotify API searches for tracks within these genres and returns the most relevant song.

4.**Dynamic Interaction**
Users interact with the app by uploading images.
Upon analysis, the app dynamically provides both the detected emotion and a Spotify song recommendation.
Results include the song name and a clickable Spotify link for immediate access.


# Screenshots


# Build Photos
![WhatsApp Image 2025-01-25 at 6 37 11 PM](https://github.com/user-attachments/assets/f2616871-abd4-45d9-b485-c32bd9eb3e68)

![WhatsApp Image 2025-01-25 at 6 37 12 PM](https://github.com/user-attachments/assets/642ec2a5-4a01-4e74-b1d2-48933791c3c5)

![WhatsApp Image 2025-01-25 at 6 37 13 PM](https://github.com/user-attachments/assets/b7dd252f-0cb8-44f2-8bf4-9d2f266f298f)



### Project Demo
# Video

Uploading WhatsApp Video 2025-01-25 at 6.36.10 PM.mp4…





## Team Contributions
- Raina Susan Ranjith : Worked with Python and Flask for Backend.
- Fidha Naisam : Created Frontend with Html,CSS and Javascript.
- Aysha Naurin : Helped creating Frontend and Documentation works. 

---
Made with ❤️ at TinkerHub
