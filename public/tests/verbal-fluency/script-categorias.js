let startTime;

document.getElementById('startTestButton').addEventListener('click', () => {
    startTime = Date.now();
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('categoryFluency1').style.display = 'block';
    loadAudio(1); // Cargar el primer audio
});

document.getElementById('fullscreenButton').addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
});

let mediaRecorder1, mediaRecorder2;
let audioChunks1 = [], audioChunks2 = [];
let mediaRecorders = [null, mediaRecorder1, mediaRecorder2];
let audioChunks = [null, audioChunks1, audioChunks2];
let timers = [null, null, null];

let audioStream = null; // Guardar el stream de audio

document.addEventListener('DOMContentLoaded', () => {
    requestMicrophonePermission();
});

function requestMicrophonePermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Tu navegador no soporta grabación de audio.');
        return;
    }

    // Verificar si ya se tiene el permiso
    if (audioStream) {
        return;
    }

    // Solicitar permisos
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream; // Guardar el stream de audio
        })
        .catch(err => {
            console.error('Error al solicitar permisos de micrófono:', err);
        });
}

function startRecording(part) {
    if (!audioStream) {
        alert('No se puede acceder al micrófono. Por favor, revisa los permisos.');
        return;
    }

    mediaRecorders[part] = new MediaRecorder(audioStream);
    mediaRecorders[part].start();
    audioChunks[part] = [];

    mediaRecorders[part].addEventListener('dataavailable', event => {
        audioChunks[part].push(event.data);
    });

    mediaRecorders[part].addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks[part], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('nextButton' + part).style.display = 'inline-block';
        showRecordingCreatedMessage(part);
        clearInterval(timers[part]); // Clear the timer when recording stops
    });

    document.getElementById('stopRecordingButton' + part).style.display = 'inline-block';
    document.getElementById('recButton' + part).style.display = 'inline-block';
    startTimer(part); // Start the timer
}

function stopRecording(part) {
    if (mediaRecorders[part]) {
        mediaRecorders[part].stop();
        document.getElementById('stopRecordingButton' + part).style.display = 'none';
        document.getElementById('recButton' + part).style.display = 'none';
        document.getElementById('instructionAudio' + part).style.display = 'none'; // Ocultar el reproductor de audio
        nextSection(part);
    }
}

function startTimer(part) {
    let timeLeft = 60;
    timers[part] = setInterval(() => {
        if (timeLeft === 0) {
            document.getElementById('stopRecordingButton' + part).style.backgroundImage = 'url("detenerr.png")'; // Change to new icon
        }
        timeLeft--;
    }, 1000);
}

document.getElementById('stopRecordingButton1').addEventListener('click', () => stopRecording(1));
document.getElementById('stopRecordingButton2').addEventListener('click', () => stopRecording(2));

document.getElementById('nextButton1').addEventListener('click', () => nextSection(1));
document.getElementById('nextButton2').addEventListener('click', () => nextSection(2));

function nextSection(part) {
    if (part === 1) {
        document.getElementById('categoryFluency1').style.display = 'none';
        document.getElementById('categoryFluency2').style.display = 'block';
        loadAudio(2); // Cargar el segundo audio
    } else if (part === 2) {
        document.getElementById('categoryFluency2').style.display = 'none';
        document.getElementById('completionMessage').style.display = 'block';
        downloadRecordingAndTime();
    }
}

function loadAudio(part) {
    const audio = document.getElementById('instructionAudio' + part);
    const letterDisplay = document.getElementById('letterDisplay' + part);
    
    switch (part) {
        case 1:
            audio.src = 'audios/prendas-de-vestir.mp3';
            break;
        case 2:
            audio.src = 'audios/animales.mp3';
            break;
    }

    audio.addEventListener('loadedmetadata', () => {
        const displayTime = audio.duration - 5;
        setTimeout(() => {
            letterDisplay.style.display = 'block';
        }, displayTime * 1000);
    });

    audio.addEventListener('ended', () => {
        letterDisplay.style.display = 'none';
        document.getElementById('startRecButton' + part).style.display = 'inline-block'; // Mostrar botón para comenzar grabación
        document.getElementById('nextButton' + part).style.display = 'inline-block'; // Mostrar la flecha
    });
}

document.getElementById('startRecButton1').addEventListener('click', () => {
    startRecording(1);
    document.getElementById('startRecButton1').style.display = 'none'; // Ocultar botón después de hacer clic
    document.getElementById('recButton1').style.display = 'inline-block'; // Mostrar imagen de grabando
});

document.getElementById('startRecButton2').addEventListener('click', () => {
    startRecording(2);
    document.getElementById('startRecButton2').style.display = 'none'; // Ocultar botón después de hacer clic
    document.getElementById('recButton2').style.display = 'inline-block'; // Mostrar imagen de grabando
});

function showRecordingCreatedMessage(part) {
    const messageElement = document.getElementById('recordingCreatedMessage' + part);
    messageElement.style.display = 'block';
}

function downloadRecordingAndTime() {
    const totalTime = Date.now() - startTime;
    const totalTimeMs = totalTime;
    const totalTimeSecs = (totalTime / 1000).toFixed(2);

    const timeBlob = new Blob([`Tiempo total: ${totalTimeMs} ms (${totalTimeSecs} s)`], { type: 'text/plain' });
    const timeUrl = URL.createObjectURL(timeBlob);

    const link = document.createElement('a');
    link.href = timeUrl;
    link.download = 'tiempo_total.txt';
    link.click();

    const zip = new JSZip();
    zip.file("tiempo_total.txt", timeBlob);

    const audio1Blob = new Blob(audioChunks[1], { type: 'audio/wav' });
    zip.file("Categoría - Parte 1.wav", audio1Blob);

    const audio2Blob = new Blob(audioChunks[2], { type: 'audio/wav' });
    zip.file("Categoría - Parte 2.wav", audio2Blob);

    zip.generateAsync({ type: 'blob' }).then(content => {
        const zipLink = document.createElement('a');
        zipLink.href = URL.createObjectURL(content);
        zipLink.download = 'Grabaciones Fluidez Verbal - Categoría.zip';
        zipLink.click();
    });
}
