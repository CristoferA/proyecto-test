let mediaRecorder;
let chunks = [];
let timerInterval;
const downloadLinks = [];
let audioStream = null; // Guardar el stream de audio

document.addEventListener('DOMContentLoaded', () => {
    requestMicrophonePermission();
});

function requestMicrophonePermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Tu navegador no soporta grabación de audio.');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioStream = stream; // Guardar el stream de audio
            document.getElementById('permission-message').classList.add('hidden');
        })
        .catch(err => {
            console.error('Error al solicitar permisos de micrófono:', err);
            document.getElementById('permission-message').classList.remove('hidden');
        });
}

function startTest(type) {
    const testItemsContainer = type === 'forward' ? document.getElementById('test-items-forward') : document.getElementById('test-items-backward');
    testItemsContainer.innerHTML = '';

    const forwardTitles = ['S3-1', 'S3-2', 'S4-1', 'S4-2', 'S5-1', 'S5-2', 'S6-1', 'S6-2', 'S7-1', 'S7-2', 'S8-1', 'S8-2', 'S9-1', 'S9-2'];
    const backwardTitles = ['S2-1', 'S2-2', 'S3-1', 'S3-2', 'S4-1', 'S4-2', 'S5-1', 'S5-2', 'S6-1', 'S6-2', 'S7-1', 'S7-2', 'S8-1', 'S8-2'];

    const titles = type === 'forward' ? forwardTitles : backwardTitles;

    titles.forEach((title, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('test-item');

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        const audio = document.createElement('audio');
        audio.src = `audio/${type}/${index + 1}.mp3`;
        audio.controls = true;

        audio.addEventListener('ended', () => {
            playBeepAndShowButtons(itemDiv, titleElement, index + 1);
        });

        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer-container');

        const timerSpan = document.createElement('span');
        timerSpan.classList.add('timer');
        timerSpan.textContent = '00:00';

        timerDiv.appendChild(timerSpan);

        const stopImg = document.createElement('img');
        stopImg.src = 'detenerr1.png';
        stopImg.classList.add('img-button', 'stop-img', 'hidden');
        stopImg.addEventListener('click', () => stopRecording(timerSpan, index + 1, itemDiv));

        const nextButton = document.createElement('button');
        nextButton.textContent = '';
        nextButton.classList.add('hidden', 'next-button');
        nextButton.addEventListener('click', () => {
            clearInterval(timerInterval);
            updateTimerDisplay(timerSpan, 0);
            itemDiv.classList.add('hidden');
            if (itemDiv.nextSibling) {
                itemDiv.nextSibling.classList.remove('hidden');
            } else {
                document.getElementById('test-items-' + type).classList.add('hidden');
                mostrarFinalizacion(type);
            }
        });

        itemDiv.appendChild(titleElement);
        itemDiv.appendChild(audio);
        itemDiv.appendChild(stopImg);
        itemDiv.appendChild(timerDiv);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(nextButton);
        itemDiv.appendChild(buttonContainer);

        if (index !== 0) itemDiv.classList.add('hidden');

        testItemsContainer.appendChild(itemDiv);
    });
}

function playBeepAndShowButtons(itemDiv, titleElement, index) {
    const beep = new Audio('beep.wav');
    beep.play();
    beep.addEventListener('ended', () => {
        startRecording(itemDiv, titleElement, index);
    });
}

function startRecording(itemDiv, titleElement, index) {
    if (!audioStream) {
        alert('No se puede acceder al micrófono. Por favor, revisa los permisos.');
        return;
    }

    mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);

        // Guardar el enlace con el título y el índice
        downloadLinks.push({ url: audioURL, title: titleElement.textContent, index: index, blob: blob });

        // Ocultar el botón de grabación y mostrar el botón de siguiente
        const stopImg = itemDiv.querySelector('.stop-img');
        stopImg.classList.add('hidden');
        const nextButton = itemDiv.querySelector('.next-button');
        nextButton.classList.remove('hidden');

        const message = document.createElement('div');
        message.textContent = 'Grabación creada';
        message.classList.add('recording-message');
        itemDiv.appendChild(message);
    };
    mediaRecorder.start();

    // Mostrar el botón de detener y el nuevo botón al iniciar la grabación
    const stopImg = itemDiv.querySelector('.stop-img');
    stopImg.classList.remove('hidden');

    const newButton = document.createElement('div');
    newButton.classList.add('img-button', 'new-button');
    newButton.style.backgroundImage = "url('boton-rec.png')";

    // Insertar el nuevo botón justo antes de stopImg
    stopImg.parentNode.insertBefore(newButton, stopImg);

    startTimer(itemDiv.querySelector('.timer'));
}

function stopRecording(timerSpan, index, itemDiv) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        clearInterval(timerInterval);

        // Mostrar el botón de siguiente y ocultar el nuevo botón si existe
        const nextButton = itemDiv.querySelector('.next-button');
        nextButton.classList.remove('hidden');

        const newButton = itemDiv.querySelector('.new-button');
        if (newButton) {
            newButton.parentNode.removeChild(newButton);
        }
    }
}

function startTimer(displayElement) {
    let time = 0;
    displayElement.textContent = formatTime(time);
    timerInterval = setInterval(() => {
        time++;
        displayElement.textContent = formatTime(time);
    }, 1000);
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(time) {
    return time.toString().padStart(2, '0');
}

function updateTimerDisplay(displayElement, time) {
    displayElement.textContent = formatTime(time);
}

function mostrarFinalizacion(type) {
    const completionMessage = document.getElementById('completion-message');

    completionMessage.style.textAlign = 'center';
    completionMessage.style.fontSize = '35px';
    completionMessage.style.marginTop = '13px';
    completionMessage.style.display = 'flex';
    crearZip(type);
}

function crearZip(type) {
    const zip = new JSZip();
    const audioFolder = zip.folder('audios');

    downloadLinks.forEach(linkData => {
        const fileName = `${type}_${linkData.title}.mp3`;
        audioFolder.file(fileName, linkData.blob);
    });

    zip.generateAsync({ type: "blob" })
        .then(content => {

            const fechaActual = new Date();
            const año = fechaActual.getFullYear();
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaActual.getDate()).padStart(2, '0');
            const horas = String(fechaActual.getHours()).padStart(2, '0');
            const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
            const segundos = String(fechaActual.getSeconds()).padStart(2, '0');

            // Formatear la fecha y la hora
            const fechaHoraFormateada = `${año}-${mes}-${dia}_${horas}-${minutos}-${segundos}`;

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = `respuestas_digital_span_${type}_${fechaHoraFormateada}.zip`;
            downloadLink.textContent = 'Descargar todas las grabaciones';
            document.body.appendChild(downloadLink);

            downloadLink.click();

            // Elimina el enlace del DOM después de la descarga
            document.body.removeChild(downloadLink);

            completionMessage.classList.remove('hidden');
        });
}
