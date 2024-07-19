document.getElementById('next-button').addEventListener('click', cambiarImagen);

const imagenes = [
    {
        src: "Emociones/Alegria/alegria1.png",
        emocionCorrecta: "Alegria",
        numero: 'E1'
    },
    {
        src: "Emociones/Miedo/miedo2.png",
        emocionCorrecta: "Miedo",
        numero: 'E2'
    },
    {
        src: "Emociones/Asco/asco3.png",
        emocionCorrecta: "Asco",
        numero: 'E3'
    },
    {
        src: "Emociones/Neutro/neutro4.png",
        emocionCorrecta: "Neutro",
        numero: 'E4'
    },
    {
        src: "Emociones/Enojo/enojo5.png",
        emocionCorrecta: "Enojo",
        numero: 'E5'
    },
    {
        src: "Emociones/Sorpresa/sorpresa6.png",
        emocionCorrecta: "Sorpresa",
        numero: 'E6'
    },
    {
        src: "Emociones/Tristeza/tristeza7.png",
        emocionCorrecta: "Tristeza",
        numero: 'E7'
    },
    {
        src: "Emociones/Miedo/miedo8.png",
        emocionCorrecta: "Miedo",
        numero: 'E8'
    },
    {
        src: "Emociones/Enojo/enojo9.png",
        emocionCorrecta: "Enojo",
        numero: 'E9'
    },
    {
        src: "Emociones/Asco/asco10.png",
        emocionCorrecta: "Asco",
        numero: 'E10'
    },
    {
        src: "Emociones/Tristeza/tristeza11.png",
        emocionCorrecta: "Tristeza",
        numero: 'E11'
    },
    {
        src: "Emociones/Alegria/alegria12.png",
        emocionCorrecta: "Alegria",
        numero: 'E12'
    },
    {
        src: "Emociones/Neutro/neutro13.png",
        emocionCorrecta: "Neutro",
        numero: 'E13'
    },
    {
        src: "Emociones/Sorpresa/sorpresa14.png",
        emocionCorrecta: "Sorpresa",
        numero: 'E14'
    },
    {
        src: "Emociones/Tristeza/tristeza15.png",
        emocionCorrecta: "Tristeza",
        numero: 'E15'
    },
    {
        src: "Emociones/Sorpresa/sorpresa16.png",
        emocionCorrecta: "Sorpresa",
        numero: 'E16'
    },
    {
        src: "Emociones/Neutro/neutro17.png",
        emocionCorrecta: "Neutro",
        numero: 'E17'
    },
    {
        src: "Emociones/Alegria/alegria18.png",
        emocionCorrecta: "Alegria",
        numero: 'E18'
    },
    {
        src: "Emociones/Miedo/miedo19.png",
        emocionCorrecta: "Miedo",
        numero: 'E19'
    },
    {
        src: "Emociones/Enojo/enojo20.png",
        emocionCorrecta: "Enojo",
        numero: 'E20'
    },
    {
        src: "Emociones/Asco/asco21.png",
        emocionCorrecta: "Asco",
        numero: 'E21'
    },
    {
        src: "Emociones/Sorpresa/sorpresa22.png",
        emocionCorrecta: "Sorpresa",
        numero: 'E22'
    },
    {
        src: "Emociones/Asco/asco23.png",
        emocionCorrecta: "Asco",
        numero: 'E23'
    },
    {
        src: "Emociones/Alegria/alegria24.png",
        emocionCorrecta: "Alegria",
        numero: 'E24'
    },
    {
        src: "Emociones/Tristeza/tristeza25.png",
        emocionCorrecta: "Tristeza",
        numero: 'E25'
    },
    {
        src: "Emociones/Neutro/neutro26.png",
        emocionCorrecta: "Neutro",
        numero: 'E26'
    },
    {
        src: "Emociones/Miedo/miedo27.png",
        emocionCorrecta: "Miedo",
        numero: 'E27'
    },
    {
        src: "Emociones/Enojo/enojo28.png",
        emocionCorrecta: "Enojo",
        numero: 'E28'
    },
    {
        src: "Emociones/Enojo/enojo29.png",
        emocionCorrecta: "Enojo",
        numero: 'E29'
    },
    {
        src: "Emociones/Miedo/miedo30.png",
        emocionCorrecta: "Miedo",
        numero: 'E30'
    },
    {
        src: "Emociones/Tristeza/tristeza31.png",
        emocionCorrecta: "Tristeza",
        numero: 'E31'
    },
    {
        src: "Emociones/Sorpresa/sorpresa32.png",
        emocionCorrecta: "Sorpresa",
        numero: 'E32'
    },
    {
        src: "Emociones/Alegria/alegria33.png",
        emocionCorrecta: "Alegria",
        numero: 'E33'
    },
    {
        src: "Emociones/Asco/asco34.png",
        emocionCorrecta: "Asco",
        numero: 'E34'
    },
    {
        src: "Emociones/Neutro/neutro35.png",
        emocionCorrecta: "Neutro",
        numero: 'E35'
    },

];

let indiceActual = 0;
let temporizador = null;
let presentacionIniciada = false;
const emocionesSeleccionadas = [];
// const emocionesDisponibles = ['Alegria', 'Asco', 'Enojo', 'Miedo', 'Neutro', 'Sorpresa', 'Tristeza'];
const emocionesDisponibles = ['Alegria', 'Sorpresa', 'Neutro', 'Tristeza', 'Miedo', 'Asco', 'Enojo'];

function mostrarEmociones() {
    const listaEmociones = document.getElementById('emotionsList');
    listaEmociones.innerHTML = ''; // Limpiar la lista antes de agregar las emociones

    emocionesDisponibles.forEach(emocion => {
        const listItem = document.createElement('li');
        listItem.textContent = emocion;
        listItem.style.cursor = 'pointer';
        listItem.addEventListener('click', function () {
            guardarSeleccion(emocion);
            document.getElementById('next-button').style.display = 'block'; // Mostrar el botón "next-button"

            // Remover la clase 'selected' de todos los elementos
            const items = listaEmociones.getElementsByTagName('li');
            for (let item of items) {
                item.classList.remove('selected');
            }

            // Agregar la clase 'selected' al elemento clickeado
            listItem.classList.add('selected');
        });
        listaEmociones.appendChild(listItem);
    });
}

document.getElementById('fullscreenButton').addEventListener('click', function () {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
});

function mostrarFinalizacion() {
    const imagenNumero = document.getElementById('imagenNumero');
    document.getElementById('next-button').style.display = 'none';
    clearTimeout(temporizador);
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '¡Has completado esta tarea con éxito! <br> ¡Muchas gracias!';
    imageContainer.style.textAlign = 'center';
    imageContainer.style.fontSize = '40px';
    imageContainer.style.marginTop = '20px';
    imageContainer.style.display = 'flex';
    imagenNumero.style.display = 'none';
    imageContainer.style.backgroundColor = 'transparent';
    document.getElementById('fullscreenButton').style.display = 'none';
    generarCSV();
}

function iniciarPresentacion() {
    presentacionIniciada = true;
    const startButton = document.getElementById('startButton');
    const imageContainer = document.getElementById('imageContainer');
    const next_button = document.getElementById('next-button');
    const instructionText = document.getElementById('instructionText');
    const imagenNumero = document.getElementById('imagenNumero');
    document.getElementById('next-button').style.display = 'none';
    imagenNumero.style.display = 'none';
    imageContainer.style.display = 'none';
    startButton.style.display = 'none';
    startButton.addEventListener('click', () => {
        imagenNumero.style.display = 'block';
        imageContainer.style.display = 'block';
        next_button.style.display = 'block';
        instructionText.style.display = 'none';
        startButton.style.display = 'none';
        mostrarImagen(indiceActual);
        mostrarEmociones();
        reiniciarTemporizador();
    });
    if (imagenes.length > 0) {
        startButton.style.display = 'block';
    }
}

function guardarSeleccion(emocion) {
    emocionesSeleccionadas[indiceActual] = emocion;
}

function cambiarImagen() {
    document.getElementById('next-button').style.display = 'block'; // Ocultar el botón "next-button"
    indiceActual++;
    if (indiceActual === imagenes.length) {
        mostrarFinalizacion();
    } else {
        mostrarImagen(indiceActual);
        reiniciarTemporizador();
        mostrarEmociones();

        // Remover la clase 'selected' de todos los elementos
        const listaEmociones = document.getElementById('emotionsList');
        const items = listaEmociones.getElementsByTagName('li');
        for (let item of items) {
            item.classList.remove('selected');
        }
    }
}

function generarCSV() {
    const fechaActual = new Date();
    const options = { timeZone: 'America/Santiago' };
    const fechaHoraChilena = fechaActual.toLocaleString('es-CL', options);
    const fechaFormateada = fechaHoraChilena.replace(/[\/\s,:]/g, '-');

    const csvData = [['Numero de Imagen', 'Emocion Seleccionada', 'Emocion Correcta']];

    emocionesSeleccionadas.forEach((emocionSeleccionada, indice) => {
        const imagenData = imagenes[indice];
        const numeroImagen = imagenData.numero;
        const emocionCorrecta = imagenData.emocionCorrecta;

        csvData.push([numeroImagen, emocionSeleccionada, emocionCorrecta]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const nombreArchivo = `respuestas_facial_emotion_${fechaFormateada}.csv`;
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', nombreArchivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function reiniciarTemporizador() {
    clearTimeout(temporizador);
    temporizador = setTimeout(cambiarImagen, 12000); // Cambia después de 12 segundos
}

function mostrarImagen(indice) {
    const imagenData = imagenes[indice];
    document.getElementById('imagenNumero').textContent = imagenData.numero;
    document.getElementById('emotionImage').src = imagenData.src;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && presentacionIniciada) {
        cambiarImagen();
    }
});

window.onload = function () {
    document.getElementById('next-button').style.display = 'block'; // Ocultar el botón "next-button" al cargar la página
    iniciarPresentacion();
};