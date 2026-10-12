// ==========================================
// 1. CONTENIDO DIARIO
// ==========================================
const contenidoDiario = [
    {
        frase: "Eres la casualidad más bonita que el destino supo regalarme.",
        musica: "assets/audios/musica/cancion1.mp3",
        voz: "assets/audios/voz/voz1.mp3",
        titulo: "Canción 1",
        portada: ""
    },
    {
        frase: "No sé hacia dónde voy, pero sé que quiero que estés a mi lado.",
        musica: "assets/audios/musica/cancion2.mp3",
        voz: "assets/audios/voz/voz2.mp3",
        titulo: "Canción 2",
        portada: ""
    },
    {
        frase: "Contigo, hasta el silencio tiene la melodía perfecta.",
        musica: "assets/audios/musica/cancion3.mp3",
        voz: "assets/audios/voz/voz3.mp3",
        titulo: "Canción 3",
        portada: ""
    }
];

const hoy = new Date();
const inicioAno = new Date(hoy.getFullYear(), 0, 0);
const diaDelAno = Math.floor((hoy - inicioAno) / (1000 * 60 * 60 * 24));
let indiceActual = diaDelAno % contenidoDiario.length;

function cargarContenido(indice) {
    const contenido = contenidoDiario[indice];
    document.getElementById('frase').innerText = `"${contenido.frase}"`;
    document.getElementById('reproductor-titulo').innerText = contenido.titulo;

    const audioVoz = document.getElementById('audio-voz');
    audioVoz.src = contenido.voz;

    const audioMusica = document.getElementById('audio-musica');
    audioMusica.src = contenido.musica;
    audioMusica.load();

    document.getElementById('barra-progreso').style.width = '0%';
    document.getElementById('tiempo-actual').innerText = '0:00';
    document.getElementById('btn-play').innerText = '▶';
}

cargarContenido(indiceActual);

// ==========================================
// 2. CONTADOR
// ==========================================
const fechaInicio = new Date(2022, 6, 11); // ⚠️ Cambia esta fecha

function actualizarContador() {
    const ahora = new Date();
    let anos = ahora.getFullYear() - fechaInicio.getFullYear();
    let meses = ahora.getMonth() - fechaInicio.getMonth();
    let dias = ahora.getDate() - fechaInicio.getDate();

    if (dias < 0) {
        meses--;
        dias += new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
    }
    if (meses < 0) { anos--; meses += 12; }

    const semanas = Math.floor(dias / 7);
    const diasRestantes = dias % 7;

    const diff = ahora - fechaInicio;
    const horas = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutos = Math.floor((diff % (1000*60*60)) / (1000*60));
    const segundos = Math.floor((diff % (1000*60)) / 1000);

    document.getElementById('anos').innerText = anos;
    document.getElementById('meses').innerText = meses;
    document.getElementById('semanas').innerText = semanas;
    document.getElementById('dias').innerText = diasRestantes;
    document.getElementById('horas').innerText = horas;
    document.getElementById('minutos').innerText = minutos;
    document.getElementById('segundos').innerText = segundos;
}
setInterval(actualizarContador, 1000);
actualizarContador();

// ==========================================
// 3. REPRODUCTOR DE MÚSICA
// ==========================================
const audioMusica = document.getElementById('audio-musica');
const btnPlay = document.getElementById('btn-play');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const barraProgreso = document.getElementById('barra-progreso');
const barraContenedor = document.querySelector('.barra-progreso-contenedor');
const tiempoActual = document.getElementById('tiempo-actual');
const tiempoTotal = document.getElementById('tiempo-total');

function formatearTiempo(segundos) {
    if (isNaN(segundos)) return '0:00';
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

btnPlay.addEventListener('click', () => {
    if (audioMusica.paused) {
        audioMusica.play();
        btnPlay.innerText = '⏸';
    } else {
        audioMusica.pause();
        btnPlay.innerText = '▶';
    }
});

btnAnterior.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + contenidoDiario.length) % contenidoDiario.length;
    cargarContenido(indiceActual);
});

btnSiguiente.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % contenidoDiario.length;
    cargarContenido(indiceActual);
});

audioMusica.addEventListener('timeupdate', () => {
    if (audioMusica.duration) {
        const progreso = (audioMusica.currentTime / audioMusica.duration) * 100;
        barraProgreso.style.width = progreso + '%';
        tiempoActual.innerText = formatearTiempo(audioMusica.currentTime);
    }
});

audioMusica.addEventListener('loadedmetadata', () => {
    tiempoTotal.innerText = formatearTiempo(audioMusica.duration);
});

audioMusica.addEventListener('ended', () => {
    btnPlay.innerText = '▶';
    barraProgreso.style.width = '0%';
});

barraContenedor.addEventListener('click', (e) => {
    if (audioMusica.duration) {
        const rect = barraContenedor.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const porcentaje = clickX / rect.width;
        audioMusica.currentTime = porcentaje * audioMusica.duration;
    }
});

// ==========================================
// 4. BOTÓN DE VOZ
// ==========================================
const audioVoz = document.getElementById('audio-voz');
const btnVoz = document.getElementById('btn-voz');

btnVoz.addEventListener('click', () => {
    if (audioVoz.paused) {
        audioVoz.play();
        btnVoz.innerText = '⏸️ Pausar mi voz';
    } else {
        audioVoz.pause();
        btnVoz.innerText = '🎙️ Escuchar mi voz';
    }
});

audioVoz.addEventListener('ended', () => {
    btnVoz.innerText = '🎙️ Escuchar mi voz';
});

// ==========================================
// 5. ANIMACIONES DE FONDO (AHORA VA ANTES DEL SELECTOR)
// ==========================================
const contenedorAnimaciones = document.getElementById('animaciones-fondo');
let intervaloAnimaciones = null;

function limpiarAnimaciones() {
    if (contenedorAnimaciones) {
        contenedorAnimaciones.innerHTML = '';
    }
    if (intervaloAnimaciones) {
        clearInterval(intervaloAnimaciones);
        intervaloAnimaciones = null;
    }
}

function crearParticula(tipo) {
    if (!contenedorAnimaciones) return;

    const p = document.createElement('div');
    p.classList.add('particula', tipo);
    p.style.left = Math.random() * 100 + '%';

    const duracion = Math.random() * 5 + 5;
    p.style.animationDuration = duracion + 's';
    p.style.animationDelay = Math.random() * 2 + 's';

    if (tipo === 'petalo') {
        const escala = Math.random() * 0.5 + 0.7;
        p.style.width = (20 * escala) + 'px';
        p.style.height = (20 * escala) + 'px';
    } else if (tipo === 'copo-nieve') {
        const escala = Math.random() * 0.8 + 0.6;
        p.style.width = (8 * escala) + 'px';
        p.style.height = (8 * escala) + 'px';
    } else if (tipo === 'estrella') {
        const escala = Math.random() * 1 + 0.5;
        p.style.width = (4 * escala) + 'px';
        p.style.height = (4 * escala) + 'px';
    } else if (tipo === 'particula-magica') {
        const escala = Math.random() * 0.5 + 0.8;
        p.style.width = (6 * escala) + 'px';
        p.style.height = (6 * escala) + 'px';
    }

    contenedorAnimaciones.appendChild(p);
    setTimeout(() => {
        if (p && p.parentNode) {
            p.parentNode.removeChild(p);
        }
    }, (duracion + 3) * 1000);
}

function iniciarAnimaciones(tema) {
    limpiarAnimaciones();
    const temasClaros = ['rosa', 'violeta-claro', 'durazno'];

    if (temasClaros.includes(tema)) {
        intervaloAnimaciones = setInterval(() => crearParticula('petalo'), 600);
        for (let i = 0; i < 10; i++) {
            setTimeout(() => crearParticula('petalo'), i * 200);
        }
    } else {
        intervaloAnimaciones = setInterval(() => {
            const r = Math.random();
            if (r > 0.6) crearParticula('copo-nieve');
            else if (r > 0.3) crearParticula('estrella');
            else crearParticula('particula-magica');
        }, 500);
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const r = Math.random();
                if (r > 0.6) crearParticula('copo-nieve');
                else if (r > 0.3) crearParticula('estrella');
                else crearParticula('particula-magica');
            }, i * 150);
        }
    }
}

// ==========================================
// 6. SELECTOR DE TEMAS (AHORA VA DESPUÉS DE ANIMACIONES)
// ==========================================
const botonesTema = document.querySelectorAll('.btn-tema');
const temasDisponibles = ['rosa', 'violeta-claro', 'durazno', 'violeta-oscuro', 'burgundy', 'azul-noche'];

function aplicarTema(nombreTema) {
    temasDisponibles.forEach(t => document.body.classList.remove(`tema-${t}`));
    document.body.classList.add(`tema-${nombreTema}`);
    localStorage.setItem('tema-preferido', nombreTema);
    iniciarAnimaciones(nombreTema);
}

botonesTema.forEach(boton => {
    boton.addEventListener('click', () => {
        aplicarTema(boton.getAttribute('data-tema'));
    });
});

const temaGuardado = localStorage.getItem('tema-preferido');
if (temaGuardado && temasDisponibles.includes(temaGuardado)) {
    aplicarTema(temaGuardado);
} else {
    aplicarTema('rosa');
}