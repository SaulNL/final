const canvas = document.getElementById('ahorcado-canvas');
const ctx = canvas.getContext('2d');
// Información del juego por nivel
const infoPorNivel = {
    paises: {
        gamesWon: 0,
        gamesLost: 0,
        rounds: 0
    },
    animales: {
        gamesWon: 0,
        gamesLost: 0,
        rounds: 0
    },
    frutas: {
        gamesWon: 0,
        gamesLost: 0,
        rounds: 0
    }
};
let nivelActual = "paises";
let palabrasUsadas = [];
let palabraSeleccionada = "";
let letrasSeleccionadas = [];
let intentosMaximos = 6;
let intentosRestantes = intentosMaximos;
// Definición de palabras por nivel
const palabras = {
    paises: ["ARGENTINA", "BRASIL", "CANADA", "ESPAÑA", "ITALIA", "FRANCIA", "ALEMANIA", "AUSTRALIA", "CHINA", "INDIA"],
    animales: ["ELEFANTE", "LEON", "JIRAFA", "CANGURO", "MURCIELAGO", "TIGRE", "COCODRILO", "PINGÜINO", "DELFIN", "TORTUGA"],
    frutas: ["MANZANA", "PLATANO", "UVA", "FRESA", "KIWI", "MANGO", "NARANJA", "CEREZA", "SANDIA", "PIÑA"]
};
// Función para dibujar la interfaz del juego
var fondoImagen = new Image();
fondoImagen.src = 'paisaje.avif';
// Esperar a que la imagen se cargue
fondoImagen.onload = function() {  
    dibujarInterfazJuego();
}
function dibujarInterfazJuego() {
    // Dibujar fondo y líneas para las letras ocultas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = "#f0f0f0";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImagen, 0, 0, canvas.width, canvas.height);
    // Dibuja el ahorcado
    dibujarAhorcado();
    // Dibuja las letras ocultas
    ctx.fillStyle = "#FFF";
    ctx.font = "30px Arial";
    const lineHeight = 30;
    const linesY = 350;

    for (let i = 0; i < palabraSeleccionada.length; i++) {
        const letra = palabraSeleccionada[i];
        if (letrasSeleccionadas.includes(letra) || letra === ' ') {
            // Muestra la letra si ya ha sido seleccionada o si es un espacio
            ctx.fillText(letra, 50 + i * 30, linesY);
        } else {
            // Si la letra no ha sido seleccionada, muestra una línea
            ctx.fillText("_", 50 + i * 30, linesY);
        }
    }

    // Dibuja contadores de juegos y rondas por nivel
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    const info = infoPorNivel[nivelActual];
    ctx.fillText(`Nivel: ${nivelActual} - Ronda: ${info.rounds} - Juegos Ganados: ${info.gamesWon} - Juegos Perdidos: ${info.gamesLost}`, 10, 20);

    // Dibujar el teclado al final de la interfaz del juego
    dibujarTeclado();
}
const teclasPresionadas = {};
// Función para dibujar el teclado en el canvas
function dibujarTeclado() {
    // Dibujar teclado en el canvas
    const tecladoInicioX = 20;
    const tecladoInicioY = canvas.height - 180; // Ajuste para dejar espacio arriba
    const teclaWidth = (canvas.width - 2 * tecladoInicioX) / 8 - 10; // Calcula el ancho según el espacio disponible
    const teclaHeight = 40;
    const margenTecla = 5;
    const borderRadius = 10; // Radio de borde

    for (let letra = 65; letra <= 90; letra++) {
        const letraChar = String.fromCharCode(letra);

        // No dibujar la tecla si ya ha sido seleccionada correctamente
        if (letrasSeleccionadas.includes(letraChar)) {
            continue;
        }

        const x = tecladoInicioX + ((letra - 65) % 8) * (teclaWidth + margenTecla);
        const y = tecladoInicioY + Math.floor((letra - 65) / 8) * (teclaHeight + margenTecla);

        // Dibujar fondo semitransparente con degradado en la tecla
        const teclaGradient = ctx.createLinearGradient(x, y, x, y + teclaHeight);
        teclaGradient.addColorStop(0, `rgba(221, 221, 221, 0.5)`);
        teclaGradient.addColorStop(1, `rgba(221, 221, 221, 0.3)`);
        ctx.fillStyle = teclaGradient;

        ctx.beginPath();
        ctx.roundRect(x, y, teclaWidth, teclaHeight, borderRadius);
        ctx.fill();

        // Dibujar la letra en la tecla
        ctx.fillStyle = "#000";
        ctx.fillText(letraChar, x + teclaWidth / 2 - 5, y + teclaHeight / 2 + 5);
    }

    // Agregar la letra Ñ
    const letraEnyeX = tecladoInicioX + 7 * (teclaWidth + margenTecla);
    const letraEnyeY = tecladoInicioY + 2 * (teclaHeight + margenTecla);

    // No dibujar la tecla Ñ si ya ha sido seleccionada correctamente
    if (!letrasSeleccionadas.includes('Ñ')) {
        // Dibujar fondo semitransparente con degradado en la tecla Ñ
        const letraEnyeGradient = ctx.createLinearGradient(letraEnyeX, letraEnyeY, letraEnyeX, letraEnyeY + teclaHeight);
        letraEnyeGradient.addColorStop(0, `rgba(221, 221, 221, 0.5)`);
        letraEnyeGradient.addColorStop(1, `rgba(221, 221, 221, 0.3)`);
        ctx.fillStyle = letraEnyeGradient;

        ctx.beginPath();
        ctx.roundRect(letraEnyeX, letraEnyeY, teclaWidth, teclaHeight, borderRadius);
        ctx.fill();

        // Dibujar la letra Ñ en la tecla
        ctx.fillStyle = "#000";
        ctx.fillText("Ñ", letraEnyeX + teclaWidth / 2 - 5, letraEnyeY + teclaHeight / 2 + 5);
    }
}
// Evento para manejar clic en el teclado
canvas.addEventListener('click', function (event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    const tecladoInicioX = 20;
    const tecladoInicioY = canvas.height - 180;
    const teclaWidth = (canvas.width - 2 * tecladoInicioX) / 8 - 10;
    const teclaHeight = 40;
    const margenTecla = 5;

    for (let letra = 65; letra <= 90; letra++) {
        const x = tecladoInicioX + ((letra - 65) % 8) * (teclaWidth + margenTecla);
        const y = tecladoInicioY + Math.floor((letra - 65) / 8) * (teclaHeight + margenTecla);

        if (clickX >= x && clickX <= x + teclaWidth && clickY >= y && clickY <= y + teclaHeight) {
            teclasPresionadas[String.fromCharCode(letra)] = true;
            dibujarTeclado();
            break;
        }
    }

    // Verificar clic en la letra Ñ
    const letraEnyeX = tecladoInicioX + 7 * (teclaWidth + margenTecla);
    const letraEnyeY = tecladoInicioY + 2 * (teclaHeight + margenTecla);

    if (clickX >= letraEnyeX && clickX <= letraEnyeX + teclaWidth && clickY >= letraEnyeY && clickY <= letraEnyeY + teclaHeight) {
        teclasPresionadas['Ñ'] = true;
        dibujarTeclado();
    }
});
// Función para dibujar un rectángulo redondeado
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
};
// Función para seleccionar una palabra al azar para el nivel actual y ronda actual
function seleccionarPalabra() {
    const palabrasNivel = palabras[nivelActual];
    const palabrasDisponibles = palabrasNivel.filter(palabra => !palabrasUsadas.includes(palabra));

    if (palabrasDisponibles.length === 0) {
        // Se han usado todas las palabras, reiniciar la lista de palabras usadas
        palabrasUsadas = [];
    }

    const indicePalabra = Math.floor(Math.random() * palabrasDisponibles.length);
    palabraSeleccionada = palabrasDisponibles[indicePalabra];
    letrasSeleccionadas = [];
    intentosRestantes = intentosMaximos;
    dibujarInterfazJuego();
    dibujarTeclado();
}
// Manejar clic en el canvas
canvas.addEventListener('mouseup', function (event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    // Verificar si se hizo clic en la zona del selector de niveles
    if (clickX >= 10 && clickX <= 210 && clickY >= 10 && clickY <= 30) {
        cambiarNivel();
    }
});
// Manejar clic en el teclado
canvas.addEventListener('click', function (event) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    // Verificar si se hizo clic en el teclado
    const tecladoInicioX = 20;
    const tecladoInicioY = canvas.height - 180;
    const teclaWidth = (canvas.width - 2 * tecladoInicioX) / 8 - 10;
    const teclaHeight = 40;
    const margenTecla = 5;

    for (let letra = 65; letra <= 90; letra++) {
        const x = tecladoInicioX + ((letra - 65) % 8) * (teclaWidth + margenTecla);
        const y = tecladoInicioY + Math.floor((letra - 65) / 8) * (teclaHeight + margenTecla);

        if (clickX >= x && clickX <= x + teclaWidth && clickY >= y && clickY <= y + teclaHeight) {
            verificarLetra(String.fromCharCode(letra));
            break;
        }
    }

    // Verificar clic en la letra Ñ
    const letraEnyeX = tecladoInicioX + 7 * (teclaWidth + margenTecla);
    const letraEnyeY = tecladoInicioY + 2 * (teclaHeight + margenTecla);

    if (clickX >= letraEnyeX && clickX <= letraEnyeX + teclaWidth && clickY >= letraEnyeY && clickY <= letraEnyeY + teclaHeight) {
        verificarLetra('Ñ');
    }

    dibujarTeclado();
});
// Función para verificar si la letra está en la palabra
function verificarLetra(letra) {
    if (!letrasSeleccionadas.includes(letra)) {
        letrasSeleccionadas.push(letra);
        if (!palabraSeleccionada.includes(letra)) {
            intentosRestantes--;
        }
        dibujarInterfazJuego();

        // Verificar si el juego ha terminado
        if (intentosRestantes <= 0) {
            // Juego perdido
            infoPorNivel[nivelActual].gamesLost++;
            window.alert("¡Perdiste! La palabra era: " + palabraSeleccionada);
            setTimeout(seleccionarPalabra, 2000); // Espera 2 segundos antes de seleccionar una nueva palabra
        } else if (!palabraSeleccionada.split('').some(letra => !letrasSeleccionadas.includes(letra))) {
            // Todas las letras han sido adivinadas
            infoPorNivel[nivelActual].gamesWon++;
            infoPorNivel[nivelActual].rounds++;
            window.alert("¡Ganaste!");
            setTimeout(seleccionarPalabra, 2000); 
        }
    }
}

const imagenesAhorcado = {
    base: 'palo.png',
    tronco: 'soga.png', 
    cara: 'cara.png',
    cuerpo: 'cuerpo.png',
    manoDerecha: 'mano2.png',
    manoIzquierda: 'imagen1.png',
};

const xTronco = 600;
const yTronco = 75;
const anchoTronco = 200;
const altoTronco = 300;
// Coordenadas y tamaños para la cara
const xCara = 730;
const yCara = 130;
const anchoCara = 70;
const altoCara = 70;
// Coordenadas y tamaños para el cuerpo
const xCuerpo = 730;
const yCuerpo = 200;
const anchoCuerpo = 70;
const altoCuerpo = 70;
// Coordenadas y tamaños para la mano derecha
const xManoDerecha = 800;
const yManoDerecha = 169;
const anchoManoDerecha = 70;
const altoManoDerecha = 94;
// Coordenadas y tamaños para la mano izquierda
const xManoIzquierda = 630;
const yManoIzquierda = 85;
const anchoManoIzquierda = 350;
const altoManoIzquierda = 300;

let primerError = false;

function dibujarAhorcado() {
    const partesAhorcado = 6 - intentosRestantes;

    // Dibujar la base
    if (!primerError) {
        const base = new Image();
        base.onload = function () {
            ctx.drawImage(base, xTronco, yTronco, anchoTronco, altoTronco);
        };
        base.onerror = function () {
            console.error("Error al cargar la imagen de la base:", imagenesAhorcado.base);
        };
        base.src = imagenesAhorcado.base;
    }

    // Dibujar partes adicionales según los intentos restantes
    if (partesAhorcado > 1) {
        const cara = new Image();
        cara.onload = function () {
            ctx.drawImage(cara, xCara, yCara, anchoCara, altoCara);
        };
        cara.onerror = function () {
            console.error("Error al cargar la imagen de la cara:", imagenesAhorcado.cara);
        };
        cara.src = imagenesAhorcado.cara;
    }

    if (partesAhorcado > 2) {
        const cuerpo = new Image();
        cuerpo.onload = function () {
            ctx.drawImage(cuerpo, xCuerpo, yCuerpo, anchoCuerpo, altoCuerpo);
        };
        cuerpo.onerror = function () {
            console.error("Error al cargar la imagen del cuerpo:", imagenesAhorcado.cuerpo);
        };
        cuerpo.src = imagenesAhorcado.cuerpo;
    }

    if (partesAhorcado > 3) {
        const manoDerecha = new Image();
        manoDerecha.onload = function () {
            ctx.drawImage(manoDerecha, xManoDerecha, yManoDerecha, anchoManoDerecha, altoManoDerecha);
        };
        manoDerecha.onerror = function () {
            console.error("Error al cargar la imagen de la mano derecha:", imagenesAhorcado.manoDerecha);
        };
        manoDerecha.src = imagenesAhorcado.manoDerecha;
    }

    if (partesAhorcado > 4) {
        const manoIzquierda = new Image();
        manoIzquierda.onload = function () {
            ctx.drawImage(manoIzquierda, xManoIzquierda, yManoIzquierda, anchoManoIzquierda, altoManoIzquierda);
        };
        manoIzquierda.onerror = function () {
            console.error("Error al cargar la imagen de la mano izquierda:", imagenesAhorcado.manoIzquierda);
        };
        manoIzquierda.src = imagenesAhorcado.manoIzquierda;
    }
}

// Función para manejar el primer error
function manejarPrimerError() {
    if (!primerError) {
        imagenesAhorcado.base = 'palo.png'; // Cambia la imagen base a palo.png
        primerError = true;
        dibujarAhorcado(); // Vuelve a dibujar para mostrar la base después del primer error
    }
}

// Función para cambiar de nivel
function cambiarNivel() {
    // Reiniciar la información del nivel actual
    infoPorNivel[nivelActual] = {
        gamesWon: 0,
        gamesLost: 0,
        rounds: 0
    };

    // Cambiar al siguiente nivel
    const niveles = ["paises", "animales", "frutas"];
    const indiceActual = niveles.indexOf(nivelActual);
    nivelActual = niveles[(indiceActual + 1) % niveles.length];

    // Lógica adicional para reiniciar el juego con el nuevo nivel
    infoPorNivel[nivelActual].rounds = 1; // Inicializa el contador de rondas para el nuevo nivel
    palabrasUsadas = []; // Reinicia la lista de palabras usadas
    seleccionarPalabra(); // Selecciona una nueva palabra para la primera ronda del nuevo nivel
}
// Llamada principal al iniciar el juego
cambiarNivel();
dibujarInterfazJuego();
dibujarTeclado();