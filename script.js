// ==========================================
// 1. CONFIGURACIÓN DEL CONTADOR
// ==========================================
// ⚠️ CAMBIA ESTA FECHA por el día exacto en que empezó vuestra relación
const fechaInicio = new Date(2022, 6, 11); // Ejemplo: 1 de Enero de 2023

function actualizarContador() {
    const ahora = new Date();
    
    // Calcular años, meses, semanas, días
    let anos = ahora.getFullYear() - fechaInicio.getFullYear();
    let meses = ahora.getMonth() - fechaInicio.getMonth();
    let dias = ahora.getDate() - fechaInicio.getDate();
    
    // Ajustar si el día actual es menor que el día de inicio
    if (dias < 0) {
        meses--;
        // Obtener el último día del mes anterior
        const ultimoDiaMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
    }
    
    // Ajustar si los meses son negativos
    if (meses < 0) {
        anos--;
        meses += 12;
    }
    
    // Calcular semanas a partir de los días restantes
    const semanas = Math.floor(dias / 7);
    const diasRestantes = dias % 7;
    
    // Calcular horas, minutos, segundos
    const diferenciaTotal = ahora - fechaInicio;
    const horas = Math.floor((diferenciaTotal % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaTotal % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenciaTotal % (1000 * 60)) / 1000);
    
    // Actualizar el DOM
    document.getElementById('anos').innerText = anos;
    document.getElementById('meses').innerText = meses;
    document.getElementById('semanas').innerText = semanas;
    document.getElementById('dias').innerText = diasRestantes;
    document.getElementById('horas').innerText = horas;
    document.getElementById('minutos').innerText = minutos;
    document.getElementById('segundos').innerText = segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador(); // Llamar una vez al inicio


// ==========================================
// 2. CONFIGURACIÓN DEL CONTENIDO DIARIO
// ==========================================
// Añade aquí tantas parejas de frase/música/voz como días quieras.
// El sistema elegirá una diferente cada día automáticamente.
const contenidoDiario = [
    {
        frase: "Eres la casualidad más bonita que el destino supo regalarme.",
        musica: "assets/audios/musica/cancion1.mp3",
        voz: "assets/audios/voz/voz1.mp3"
    },
    {
        frase: "No sé hacia dónde voy, pero sé que quiero que estés a mi lado.",
        musica: "assets/audios/musica/cancion2.mp3",
        voz: "assets/audios/voz/voz2.mp3"
    },
    {
        frase: "Contigo, hasta el silencio tiene la melodía perfecta.",
        musica: "assets/audios/musica/cancion3.mp3",
        voz: "assets/audios/voz/voz3.mp3"
    }
    // ¡Sigue añadiendo objetos aquí!
];

// Lógica para elegir el contenido de HOY
// Usamos el día del año para que sea cíclico y cambie cada 24h
const hoy = new Date();
const inicioAno = new Date(hoy.getFullYear(), 0, 0);
const diff = hoy - inicioAno;
const diaDelAno = Math.floor(diff / (1000 * 60 * 60 * 24));

// Usamos el módulo (%) para que si hay 3 frases, el día 4 vuelva a ser la 1, etc.
const indiceHoy = diaDelAno % contenidoDiario.length; 
const contenidoDeHoy = contenidoDiario[indiceHoy];

// Pintar la frase en la web
document.getElementById('frase').innerText = `"${contenidoDeHoy.frase}"`;

// Configurar las rutas de los audios
const audioVoz = document.getElementById('audio-voz');
const audioMusica = document.getElementById('audio-musica');

audioVoz.src = contenidoDeHoy.voz;
audioMusica.src = contenidoDeHoy.musica;


// ==========================================
// 3. CONTROLES DE REPRODUCCIÓN
// ==========================================

// Botón de tu voz
document.getElementById('btn-voz').addEventListener('click', () => {
    if (audioVoz.paused) {
        audioVoz.play();
        document.getElementById('btn-voz').innerText = '⏸️ Pausar mi voz';
    } else {
        audioVoz.pause();
        document.getElementById('btn-voz').innerText = '🎙️ Escuchar mi voz';
    }
});

// Cuando tu voz termina, volver al estado original
audioVoz.addEventListener('ended', () => {
    document.getElementById('btn-voz').innerText = '🎙️ Escuchar mi voz';
});

// Botón de música de fondo
const btnMusica = document.getElementById('btn-musica');
btnMusica.addEventListener('click', () => {
    if (audioMusica.paused) {
        audioMusica.play();
        btnMusica.innerText = '⏸️ Pausar música';
    } else {
        audioMusica.pause();
        btnMusica.innerText = '▶️ Reproducir música';
    }
});