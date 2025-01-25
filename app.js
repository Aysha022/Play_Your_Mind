const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const openCameraButton = document.getElementById('openCamera');
const openUploadButton = document.getElementById('openUpload');
const captureButton = document.getElementById('capture');
const uploadInput = document.getElementById('upload');
const analyzeButton = document.getElementById('analyze');
const emotionResult = document.getElementById('emotionResult');
const audioPlayer = document.getElementById('audioPlayer');

const cameraSection = document.getElementById('cameraSection');
const uploadSection = document.getElementById('uploadSection');

const emotionSongs = {
  "happy": [
      "Songs/Paranne-Benny-Dayal-Raghu-Dixit.mp3",
      "songs/happy2.mp3",
      "songs/happy3.mp3"
  ],
  "sad": [
      "songs/sad1.mp3",
      "songs/sad2.mp3",
      "songs/sad3.mp3"
  ],
  "angry": [
      "songs/angry1.mp3",
      "songs/angry2.mp3",
      "songs/angry3.mp3"
  ],
  "neutral": [
      "songs/neutral1.mp3",
      "songs/neutral2.mp3",
      "songs/neutral3.mp3"
  ],
  "surprise": [
      "songs/surprise1.mp3",
      "songs/surprise2.mp3",
      "songs/surprise3.mp3"
  ]
};

// Show Camera and Hide Upload
openCameraButton.addEventListener('click', () => {
    cameraSection.style.display = 'block';
    uploadSection.style.display = 'none';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { video.srcObject = stream; })
        .catch(err => { console.error("Error accessing webcam", err); });
});

// Show Upload and Hide Camera
openUploadButton.addEventListener('click', () => {
    uploadSection.style.display = 'block';
    cameraSection.style.display = 'none';
    video.srcObject = null;
});

// Capture Photo from Webcam
captureButton.addEventListener('click', () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Show Uploaded Image
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Analyze Emotion and Play Song
analyzeButton.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("image", blob, "uploaded_image.png");

        fetch("http://127.0.0.1:5000/analyze", {  
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            emotionResult.innerText = Detected Emotion: ${data.emotion};
            playSong(data.emotion);
        })
        .catch(error => console.error("Error analyzing emotion", error));
    });
});

function playSong(emotion) {
    if (emotionSongs[emotion]) {
      const songList=emotionSongs[emotion];
      const randomSong =songList[Math.floor(Math.random() *songList.length)];

        audioPlayer.src = randomSong;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
    } else {
        emotionResult.innerText += " (No matching song found)";
    }
}
