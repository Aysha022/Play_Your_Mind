const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const openCameraButton = document.getElementById('openCamera');
const openUploadButton = document.getElementById('openUpload');
const captureButton = document.getElementById('capture');
const uploadInput = document.getElementById('upload');
const analyzeButton = document.getElementById('analyze');
const emotionResult = document.getElementById('emotionResult');

const cameraSection = document.getElementById('cameraSection');
const uploadSection = document.getElementById('uploadSection');

// Function to Show Camera and Hide Upload
openCameraButton.addEventListener('click', () => {
    cameraSection.style.display = 'block';
    uploadSection.style.display = 'none';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { video.srcObject = stream; })
        .catch(err => { console.error("Error accessing webcam", err); });
});

// Function to Show Upload and Hide Camera
openUploadButton.addEventListener('click', () => {
    uploadSection.style.display = 'block';
    cameraSection.style.display = 'none';
    video.srcObject = null; // Stop webcam if switching to upload
});

// Capture Photo from Webcam and Display on Canvas
captureButton.addEventListener('click', () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Show Uploaded Image in Canvas
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image on canvas
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Upload & Send Image for Analysis
analyzeButton.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        if (blob) {
            console.log('Blob created successfully');
            const formData = new FormData();
            formData.append("image", blob, "uploaded_image.png");

            fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                emotionResult.innerText = `Detected Emotion: ${data.emotion}`;
                if (data.song && data.song.song_name) {
                    emotionResult.innerHTML += `<br><a href="${data.song.song_url}" target="_blank">Play Song: ${data.song.song_name}</a>`;
                }
            })
            .catch(error => console.error("Error analyzing emotion", error));
        } else {
            console.error('Failed to create blob from canvas');
        }
    });
});
