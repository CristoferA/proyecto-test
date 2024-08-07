document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
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

    function drawCircle(ctx, x, y, number, circlesArray, name = "") {
        ctx.fillStyle = 'white'; // Fondo blanco
        ctx.beginPath();
        ctx.arc(x, y, 29, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.lineWidth = 1; // Grosor del borde
        ctx.strokeStyle = 'black'; // Color del borde
        ctx.stroke();

        ctx.fillStyle = 'black'; // Texto negro
        ctx.font = '27px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number, x, y);

        if (name) {
            ctx.font = '14px Arial';
            ctx.fillText(name, x, y + 45); // Mostrar el nombre debajo del círculo
        }

        circlesArray.push({ x, y, number });
    }

    function drawInvalidLine(ctx, startX, startY, endX, endY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'red'; // Color para las líneas incorrectas
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.strokeStyle = 'black'; // Restablecer el color para futuras líneas correctas
    }

    // PRIMER CANVAS

    function startTest() {
        document.getElementById('instructions').style.display = 'none';
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
        circles.length = 0;
        currentCircle = 1;
        lastCircle = null;
        correctPaths.length = 0;

        // Coordenadas predefinidas de los círculos
        const circleCoordinates = [
            { x: 450, y: 460 },
            { x: 620, y: 190 },
            { x: 850, y: 470 },
            { x: 650, y: 370 },
            { x: 650, y: 580 },
            { x: 200, y: 610 },
            { x: 140, y: 320 },
            { x: 400, y: 250 }
        ];

        // Dibujar círculos con las coordenadas predefinidas
        circleCoordinates.forEach((coord, index) => {
            const name = index === 0 ? "Inicio" : (index === circleCoordinates.length - 1 ? "Fin" : "");
            drawCircle(ctx, coord.x, coord.y, index + 1, circles, name);
        });
    }

    let drawingCompleted = false; // Bandera para indicar si se completó el dibujo

    canvas.addEventListener('mousedown', function (event) {
        if (drawingCompleted) return; // Si el dibujo está completo, no hacer nada
        const x = event.offsetX;
        const y = event.offsetY;

        circles.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < 20 && circle.number === currentCircle) {
                isDrawing = true;
                lastCircle = circle;
                ctx.beginPath();
                ctx.moveTo(circle.x, circle.y);
            }
        });
    });

    canvas.addEventListener('mousemove', function (event) {
        if (!isDrawing) return;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', function (event) {
        if (drawingCompleted) return; // Si el dibujo está completo, no hacer nada
        const x = event.offsetX;
        const y = event.offsetY;
        let validDrop = false;

        circles.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < 20 && circle.number === currentCircle + 1) {
                ctx.lineTo(circle.x, circle.y);
                ctx.stroke();
                correctPaths.push([{ x: lastCircle.x, y: lastCircle.y }, { x: circle.x, y: circle.y }]);
                currentCircle++;
                lastCircle = circle;
                validDrop = true;
            }
        });

        if (!validDrop && lastCircle) {
            drawInvalidLine(ctx, lastCircle.x, lastCircle.y, x, y);
        }

        if (currentCircle === 8) {
            drawNextButton();
            drawingCompleted = true; // Establecer la bandera en true cuando se complete el dibujo
        }

        isDrawing = false;
    });

    document.getElementById('continueButton').addEventListener('click', () => {
        startPartA();
    });

    // BOTON SIGUIENTE LUEGO DE DIBUJAR TODAS LAS LINEAS PRIMER CANVAS
    function drawNextButton() {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.style.position = 'absolute';
        nextButton.style.bottom = '20px';
        nextButton.style.right = '20px';
        nextButton.style.padding = '10px 20px';
        nextButton.style.fontSize = '16px';
        nextButton.style.color = 'white';
        nextButton.style.backgroundColor = 'blue';
        nextButton.style.border = 'none';
        nextButton.style.borderRadius = '5px';
        nextButton.style.cursor = 'pointer';

        nextButton.addEventListener('click', () => {
            canvas.style.display = 'none'; // Ocultar el canvas actual
            document.getElementById('partA').style.display = 'block'; // Mostrar instrucciones para la Parte B
            document.getElementById('continueButton').style.display = 'block'; // Mostrar botón de continuar
            nextButton.remove(); // Eliminar el botón "Siguiente" después de hacer clic
        });

        document.body.appendChild(nextButton);
    }

    // SEGUNDO CANVAS

    function startPartA() {
        document.getElementById('partA').style.display = 'none';
        canvasPartA.style.display = 'block';
        ctxPartA.clearRect(0, 0, canvasPartA.width, canvasPartA.height); // Limpiar el lienzo
        circlesPartA.length = 0;
        currentCirclePartA = 1;
        lastCirclePartA = null;
        correctPathsPartA.length = 0;

        // Coordenadas predefinidas de los círculos
        const circleCoordinatesPartA = [
            { x: 610, y: 800 },
            { x: 450, y: 870 },
            { x: 680, y: 910 },
            { x: 650, y: 600 },
            { x: 400, y: 600 },
            { x: 510, y: 750 },
            { x: 350, y: 810 },
            { x: 210, y: 920 },
            { x: 260, y: 1070 },
            { x: 350, y: 950 },

            { x: 600, y: 1030 },
            { x: 150, y: 1200 },
            { x: 150, y: 700 },
            { x: 60, y: 840 },
            { x: 100, y: 150 },
            { x: 200, y: 300 },
            { x: 450, y: 120 },
            { x: 450, y: 450 },
            { x: 710, y: 210 },
            { x: 550, y: 200 },

            { x: 800, y: 90 },
            { x: 810, y: 550 },
            { x: 810, y: 1200 },
            { x: 760, y: 750 },
            { x: 740, y: 1080 }
        ];

        // Dibujar círculos con las coordenadas predefinidas
        circleCoordinatesPartA.forEach((coord, index) => {
            const name = index === 0 ? "Inicio" : (index === circleCoordinatesPartA.length - 1 ? "Fin" : "");
            drawCircle(ctxPartA, coord.x, coord.y, index + 1, circlesPartA, name);
        });
    }

    let drawingCompletedA = false; // Bandera para indicar si se completó el dibujo

    canvasPartA.addEventListener('mousedown', function (event) {
        if (drawingCompletedA) return; // Si el dibujo está completo, no hacer nada
        const x = event.offsetX;
        const y = event.offsetY;

        circlesPartA.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < 20 && circle.number === currentCirclePartA) {
                isDrawingPartA = true;
                lastCirclePartA = circle;
                ctxPartA.beginPath();
                ctxPartA.moveTo(circle.x, circle.y);
            }
        });
    });

    canvasPartA.addEventListener('mousemove', function (event) {
        if (!isDrawingPartA) return;
        ctxPartA.lineTo(event.offsetX, event.offsetY);
        ctxPartA.stroke();
    });

    canvasPartA.addEventListener('mouseup', function (event) {
        if (drawingCompletedA) return; // Si el dibujo está completo, no hacer nada
        const x = event.offsetX;
        const y = event.offsetY;
        let validDrop = false;

        circlesPartA.forEach(circle => {
            const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
            if (distance < 20 && circle.number === currentCirclePartA + 1) {
                ctxPartA.lineTo(circle.x, circle.y);
                ctxPartA.stroke();
                correctPathsPartA.push([{ x: lastCirclePartA.x, y: lastCirclePartA.y }, { x: circle.x, y: circle.y }]);
                currentCirclePartA++;
                lastCirclePartA = circle;
                validDrop = true;
            }
        });

        if (!validDrop && lastCirclePartA) {
            drawInvalidLine(ctxPartA, lastCirclePartA.x, lastCirclePartA.y, x, y);
        }

        if (currentCirclePartA === 25) {
            drawNextButtonA();
            drawingCompletedA = true; // Establecer la bandera en true cuando se complete el dibujo
        }

        isDrawingPartA = false;
    });

    startButton.addEventListener('click', () => {
        startTest();
    });

    //BOTON SIGUIENTE LUEGO DE DIBUJAR TODAS LAS LINEAS SEGUNDO CANVAS
    function drawNextButtonA() {
        const nextButtonA = document.createElement('button');
        nextButtonA.textContent = 'Siguiente';
        nextButtonA.style.position = 'absolute';
        nextButtonA.style.bottom = '20px';
        nextButtonA.style.right = '20px';
        nextButtonA.style.padding = '10px 20px';
        nextButtonA.style.fontSize = '16px';
        nextButtonA.style.color = 'white';
        nextButtonA.style.backgroundColor = 'blue';
        nextButtonA.style.border = 'none';
        nextButtonA.style.borderRadius = '5px';
        nextButtonA.style.cursor = 'pointer';

        nextButtonA.addEventListener('click', () => {
            canvasPartA.style.display = 'none'; // Ocultar el canvas actual
            document.getElementById('partB').style.display = 'block'; // Mostrar instrucciones para la Parte B
            document.getElementById('continueButtonB').style.display = 'block'; // Mostrar botón de continuar
            nextButtonA.remove(); // Eliminar el botón "Siguiente" después de hacer clic
        });

        document.body.appendChild(nextButtonA);
    }

    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen();
        } else {
            console.log('El modo de pantalla completa no es soportado por tu navegador.');
        }
    });    
});
