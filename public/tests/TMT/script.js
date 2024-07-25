document.addEventListener('DOMContentLoaded', function () {
    // const startButton = document.getElementById('startButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const canvas = document.getElementById('tmtCanvas');
    const canvasPartA = document.getElementById('tmtCanvasPartA');
    const ctx = canvas.getContext('2d');
    const ctxPartA = canvasPartA.getContext('2d');
    const circles = [];
    const circlesPartA = [];
    let currentCircle = 1; // El siguiente número que debe ser seleccionado
    let currentCirclePartA = 1; // El siguiente número que debe ser seleccionado en la parte B
    let isDrawing = false;
    let isDrawingPartA = false;
    let lastCircle = null;
    let lastCirclePartA = null;
    const correctPaths = []; // Para almacenar caminos correctos
    const correctPathsPartA = []; // Para almacenar caminos correctos en la parte B
    const incorrectPaths = []; // Para almacenar caminos incorrectos
    const incorrectPathsPartA = []; // Para almacenar caminos incorrectos en la parte B
    let temporizador = null;
    const circlesToCorrect = []; // Para almacenar los círculos que se deben corregir

    const endSequenceButton = document.createElement('button'); // Crear el botón "Terminar"
    endSequenceButton.id = 'endSequenceButton'; // Asignar el id para aplicar estilos CSS
    document.body.appendChild(endSequenceButton);

    const redLinesCount = 0; // Contador para líneas incorrectas 

    function drawCircle(ctx, x, y, number, circlesArray, name = "", circleRadius) {
        ctx.fillStyle = 'white'; // Fondo blanco
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.lineWidth = 1; // Grosor del borde
        ctx.strokeStyle = 'black'; // Color del borde
        ctx.stroke();

        ctx.fillStyle = 'black'; // Texto negro
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number, x, y);

        if (name) {
            ctx.font = 'bold 18px Arial';
            ctx.fillText(name, x, y - circleRadius - 20); // Mostrar el nombre debajo del círculo
        }

        circlesArray.push({ x, y, number });
    }

    function getTouchPos(canvasDom, touchEvent) {
        const rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    function highlightCircle(ctx, circle, color, lastX, lastY) {
        ctx.lineWidth = 3; // Aumentar el grosor del borde
        ctx.strokeStyle = color; // Color para el borde resaltado
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.strokeStyle = 'black'; // Restablecer el color para futuras líneas correctas
        ctx.lineWidth = 1; // Restablecer el grosor del borde
        ctx.moveTo(lastX, lastY); // mueve el cursor desde el ultimo punto que se dibujo el arco hasta donde se encuentra el mouse
    }

    function drawLineToCircleEdge(ctx, startX, startY, endX, endY) {
        const angle = Math.atan2(endY - startY, endX - startX);
        const edgeX = endX - circleRadius * Math.cos(angle);
        const edgeY = endY - circleRadius * Math.sin(angle);
        ctx.lineTo(edgeX, edgeY);
        ctx.stroke();
    }

    function startRecording(canvas, recordedChunks) {
        const stream = canvas.captureStream();
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.start();
        return mediaRecorder;
    }

    // PRIMER CANVAS

    function startTest() {
        document.getElementById('instructions').style.display = 'flex';
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
        circles.length = 0;
        currentCircle = 1;
        lastCircle = null;
        correctPaths.length = 0;
        incorrectPaths.length = 0;
        circleRadius = 40;
        circlesToCorrect.length = 0;

        // Coordenadas predefinidas de los círculos
        const circleCoordinates = [
            { x: 450, y: 460 },
            { x: 600, y: 200 },
            { x: 840, y: 470 },
            { x: 650, y: 350 },
            { x: 670, y: 580 },
            { x: 180, y: 610 },
            { x: 130, y: 320 },
            { x: 400, y: 250 }
        ];

        // Dibujar círculos con las coordenadas predefinidas
        circleCoordinates.forEach((coord, index) => {
            const name = index === 0 ? "Empezar" : (index === circleCoordinates.length - 1 ? "Terminar" : "");
            drawCircle(ctx, coord.x, coord.y, index + 1, circles, name, circleRadius);
        });
        drawNextButton();
    }

    window.onload = function () {
        startTest();
    }

    let drawingCompleted = false; // Bandera para indicar si se completó el dibujo

    function startDrawing(x, y) {
        circles.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < circleRadius && circle.number === currentCircle) {
                isDrawing = true;
                lastCircle = circle;
                ctx.beginPath();
                ctx.moveTo(circle.x, circle.y);
            }
        });
    }

    function draw(x, y) {
        if (drawingCompleted) return; // Si el dibujo está completo, no hacer nada
        if (!isDrawing) return;
        ctx.lineTo(x, y);
        ctx.stroke();

        let validDrop = false;

        circles.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance <= circleRadius && circle.number != currentCircle + 1 && lastCircle.number != circle.number) {
                highlightCircle(ctx, circle, 'red', x, y);
                incorrectPaths.push([{ x: lastCircle.x, y: lastCircle.y }, { x, y }]);
                circlesToCorrect.push({ x: circle.x, y: circle.y, number: circle.number });
                isDrawing = false;
            } else if (distance <= circleRadius && circle.number === currentCircle + 1) {
                highlightCircle(ctx, circle, 'black', x, y); // Restablecer el borde correcto
                correctPaths.push([{ x: lastCircle.x, y: lastCircle.y }, { x: circle.x, y: circle.y }]);
                currentCircle++;
                lastCircle = circle;
                validDrop = true;
                
                if (circlesToCorrect.length > 0) {
                    circlesToCorrect.forEach(circle => {
                        highlightCircle(ctx, circle, 'black', x, y);
                    });
                    circlesToCorrect.length = 0;
                }
            }
        });

        if (currentCircle === 8) {
            
            drawingCompleted = true; // Establecer la bandera en true cuando se complete el dibujo
        }
    }

    function endDrawing(x, y) {
        let validDrop = false;

        circles.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < circleRadius && circle.number === currentCircle + 1) {
                drawLineToCircleEdge(ctx, lastCircle.x, lastCircle.y, circle.x, circle.y);
                highlightCircle(ctx, circle, 'black', x, y); // Restablecer el borde correcto
                correctPaths.push([{ x: lastCircle.x, y: lastCircle.y }, { x: circle.x, y: circle.y }]);
                currentCircle++;
                lastCircle = circle;
                validDrop = true;
            }
        });

        const distance = Math.sqrt((x - lastCircle.x) ** 2 + (y - lastCircle.y) ** 2);

        if (!validDrop && lastCircle && distance > circleRadius) {
            incorrectPaths.push([{ x: lastCircle.x, y: lastCircle.y }, { x, y }]);
        }

        if (currentCircle === 8) {
            drawNextButton();
            drawingCompleted = true; // Establecer la bandera en true cuando se complete el dibujo
        }

        isDrawing = false;
    }



    canvas.addEventListener('mousedown', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        startDrawing(x, y);
    });

    canvas.addEventListener('mousemove', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        draw(x, y);
    });

    canvas.addEventListener('mouseup', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        endDrawing(x, y);
    });

    canvas.addEventListener('touchstart', function (event) {
        const touchPos = getTouchPos(canvas, event);
        startDrawing(touchPos.x, touchPos.y);
    });

    canvas.addEventListener('touchmove', function (event) {
        const touchPos = getTouchPos(canvas, event);
        draw(touchPos.x, touchPos.y);
        event.preventDefault(); // Evitar el desplazamiento de la pantalla al dibujar
    });

    canvas.addEventListener('touchend', function (event) {
        const touchPos = getTouchPos(canvas, event);
        endDrawing(touchPos.x, touchPos.y);
    });

    // BOTON SIGUIENTE LUEGO DE DIBUJAR TODAS LAS LINEAS PRIMER CANVAS
    function drawNextButton() {
        const nextButton = document.createElement('button');
        nextButton.id = 'endSequenceButton'; // Asignar el id para aplicar estilos CSS
        nextButton.style.display = 'inline-block';

        nextButton.addEventListener('click', () => {
            document.getElementById('instructions').style.display = 'none';
            canvas.style.display = 'none'; // Ocultar el canvas actual
            document.getElementById('partA').style.display = 'flex'; // Mostrar instrucciones para la Parte B
            // document.getElementById('continueButton').style.display = 'block'; // Mostrar botón de continuar
            nextButton.remove(); // Eliminar el botón "Siguiente" después de hacer clic
            startPartA();
        });

        document.body.appendChild(nextButton);
    }

    // SEGUNDO CANVAS

    function reiniciarTemporizador() {
        clearTimeout(temporizador);
        temporizador = setTimeout(arrowToRed, 150000); // Cambia después de 150 segundos
        // temporizador = setTimeout(testFinalizado, 3000); // Cambia después de 3 segundos
    }

    function arrowToRed() {
        const arrow = document.getElementById('endSequenceButton');
        arrow.style.backgroundImage =  "url('imagenes/flecha4.png')";
    
    }

    function playBeep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioUrl = 'beep.wav';

        fetch(audioUrl)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
            })
            .catch(e => console.error('Error al cargar el archivo de audio:', e));
    }

    function startPartA() {
        // document.getElementById('partA').style.display = 'none';
        canvasPartA.style.display = 'block';
        ctxPartA.clearRect(0, 0, canvasPartA.width, canvasPartA.height); // Limpiar el lienzo
        circlesPartA.length = 0;
        currentCirclePartA = 1;
        lastCirclePartA = null;
        correctPathsPartA.length = 0;
        incorrectPathsPartA.length = 0;
        circleRadius = 30;

        // Coordenadas predefinidas de los círculos
        const circleCoordinatesPartA = [
            { x: 610, y: 800 },
            { x: 431, y: 937 },
            { x: 684, y: 981 },
            { x: 651, y: 590 },
            { x: 397, y: 626 },
            { x: 518, y: 717 },
            { x: 373, y: 811 },
            { x: 234, y: 979 },
            { x: 288, y: 1099 },
            { x: 351, y: 975 },

            { x: 567, y: 1137 },
            { x: 160, y: 1186 },
            { x: 230, y: 704 },
            { x: 134, y: 841 },
            { x: 142, y: 300 },
            { x: 232, y: 465 },
            { x: 465, y: 266 },
            { x: 439, y: 495 },
            { x: 697, y: 355 },
            { x: 549, y: 347 },

            { x: 774, y: 248 },
            { x: 764, y: 564 },
            { x: 791, y: 1160 },
            { x: 741, y: 766 },
            { x: 702, y: 1123 }
        ];

        // Dibujar círculos con las coordenadas predefinidas
        circleCoordinatesPartA.forEach((coord, index) => {
            const name = index === 0 ? "Empezar" : (index === circleCoordinatesPartA.length - 1 ? "Terminar" : "");
            drawCircle(ctxPartA, coord.x, coord.y, index + 1, circlesPartA, name, circleRadius);
        });
        reiniciarTemporizador(); // Iniciar temporizador
    }

    let drawingCompletedA = false; // Bandera para indicar si se completó el dibujo

    function startDrawingPartA(x, y) {
        circlesPartA.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < circleRadius && circle.number === currentCirclePartA) {
                isDrawingPartA = true;
                lastCirclePartA = circle;
                ctxPartA.beginPath();
                ctxPartA.moveTo(circle.x, circle.y);
            }
        });
    }

    function drawPartA(x, y) {
        if (drawingCompletedA) return; // Si el dibujo está completo, no hacer nada
        if (!isDrawingPartA) return;
        ctxPartA.lineTo(x, y);
        ctxPartA.stroke();

        let validDrop = false;

        circlesPartA.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < circleRadius && circle.number != currentCirclePartA + 1 && lastCirclePartA.number != circle.number) {
                highlightCircle(ctxPartA, circle, 'red', x, y);
                // drawInvalidLine(ctxPartA, circle.x, circle.y, circle.number);
                incorrectPathsPartA.push([{ x: lastCirclePartA.x, y: lastCirclePartA.y }, { x, y }]);
                isDrawingPartA = false;
            } else if (distance < circleRadius && circle.number === currentCirclePartA + 1) {
                highlightCircle(ctxPartA, circle, 'black', x, y); // Restablecer el borde correcto
                correctPathsPartA.push([{ x: lastCirclePartA.x, y: lastCirclePartA.y }, { x: circle.x, y: circle.y }]);
                currentCirclePartA++;
                lastCirclePartA = circle;
                validDrop = true;
            }
        });

        if (currentCirclePartA === 25) {
            drawNextButtonA();
            drawingCompletedA = true; // Establecer la bandera en true cuando se complete el dibujo
        }
    }

    function endDrawingPartA(x, y) {
        let validDrop = false;

        circlesPartA.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < circleRadius && circle.number === currentCirclePartA + 1) {
                drawLineToCircleEdge(ctxPartA, lastCirclePartA.x, lastCirclePartA.y, circle.x, circle.y);
                highlightCircle(ctxPartA, circle, 'black', x, y); // Restablecer el borde correcto
                correctPathsPartA.push([{ x: lastCirclePartA.x, y: lastCirclePartA.y }, { x: circle.x, y: circle.y }]);
                currentCirclePartA++;
                lastCirclePartA = circle;
                validDrop = true;
            }
        });

        const distance = Math.sqrt((x - lastCirclePartA.x) ** 2 + (y - lastCirclePartA.y) ** 2);

        if (!validDrop && lastCirclePartA && distance > circleRadius) {
            incorrectPathsPartA.push([{ x: lastCirclePartA.x, y: lastCirclePartA.y }, { x, y }]);
        }

        if (currentCirclePartA === 25) {
            drawNextButtonA();
            drawingCompletedA = true; // Establecer la bandera en true cuando se complete el dibujo
        }

        isDrawingPartA = false;
    }

    canvasPartA.addEventListener('mousedown', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        startDrawingPartA(x, y);
    });

    canvasPartA.addEventListener('mousemove', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        drawPartA(x, y);
    });

    canvasPartA.addEventListener('mouseup', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        endDrawingPartA(x, y);
    });

    canvasPartA.addEventListener('touchstart', function (event) {
        const touchPos = getTouchPos(canvasPartA, event);
        startDrawingPartA(touchPos.x, touchPos.y);
    });

    canvasPartA.addEventListener('touchmove', function (event) {
        const touchPos = getTouchPos(canvasPartA, event);
        drawPartA(touchPos.x, touchPos.y);
        event.preventDefault(); // Evitar el desplazamiento de la pantalla al dibujar
    });

    canvasPartA.addEventListener('touchend', function (event) {
        const touchPos = getTouchPos(canvasPartA, event);
        endDrawingPartA(touchPos.x, touchPos.y);
    });

    //BOTON SIGUIENTE LUEGO DE DIBUJAR TODAS LAS LINEAS SEGUNDO CANVAS
    function drawNextButtonA() {
        const nextButtonA = document.createElement('button');
        nextButtonA.id = 'endSequenceButton';
        nextButtonA.style.display = 'inline-block';

        nextButtonA.addEventListener('click', () => {
            document.getElementById('partA').style.display = 'none';
            canvasPartA.style.display = 'none'; // Ocultar el canvas actual
            nextButtonA.remove(); // Eliminar el botón "Siguiente" después de hacer clic
            testFinalizado();
        });

        document.body.appendChild(nextButtonA);
    }

    function testFinalizado() {
        canvasPartA.style.display = 'none'; // Ocultar el canvas actual
        // Mostrar mensaje de finalización
        const instructions = document.getElementById('instructions');
        instructions.style.display = 'flex';
        instructions.style.justifyContent = 'center'; // Centrar contenido horizontalmente
        instructions.style.alignItems = 'center'; // Centrar contenido verticalmente
        instructions.style.height = '100vh'; // Altura del viewport para permitir el centrado vertical
        instructions.innerHTML = '¡Has completado esta tarea con éxito! <br> ¡Muchas gracias!';
        instructions.style.textAlign = 'center';
        instructions.style.fontSize = '40px';
        instructions.style.marginTop = '0'; // Asegúrate de resetear el marginTop si ya no es necesario

        const downloadButton = document.createElement('button');
        downloadButton.addEventListener('click', function () {
            downloadAllCanvasImages();
            document.body.removeChild(downloadButton);
        });
        document.body.appendChild(downloadButton);
        downloadButton.click();
    }

    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenEnabled && !document.fullscreenElement) {
            fullscreenButton.style.backgroundImage = "url('imagenes/minimize.png')"; // Cambiar la imagen del botón a 'minimize'
            document.documentElement.requestFullscreen();
        } else if (document.fullscreenElement) {
            fullscreenButton.style.backgroundImage = "url('imagenes/full-screen.png')"; // Cambiar la imagen del botón a 'full-screen'
            document.exitFullscreen();
        } else {
            console.log('El modo de pantalla completa no es soportado por tu navegador.');
        }
    });

    function downloadAllCanvasImages() {
        downloadCanvasImage(canvasPartA, 'canvasPartA.png');
        downloadCanvasImage(canvas, 'canvas.png');
    }

    function downloadCanvasImage(canvas, fileName) {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = fileName;
        link.click();
    }
});
