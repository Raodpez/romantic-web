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

// ==========================================
// 4. SELECTOR DE TEMAS
// ==========================================
const botonesTema = document.querySelectorAll('.btn-tema');
const temasDisponibles = ['rosa', 'violeta-claro', 'durazno', 'violeta-oscuro', 'burgundy', 'azul-noche'];

// Función para aplicar un tema
function aplicarTema(nombreTema) {
    // Remover todas las clases de tema
    temasDisponibles.forEach(tema => {
        document.body.classList.remove(`tema-${tema}`);
    });
    
    // Aplicar el nuevo tema
    document.body.classList.add(`tema-${nombreTema}`);
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('tema-preferido', nombreTema);
}

// Event listeners para cada botón
botonesTema.forEach(boton => {
    boton.addEventListener('click', () => {
        const tema = boton.getAttribute('data-tema');
        aplicarTema(tema);
    });
});

// Cargar el tema guardado al iniciar (si existe)
const temaGuardado = localStorage.getItem('tema-preferido');
if (temaGuardado && temasDisponibles.includes(temaGuardado)) {
    aplicarTema(temaGuardado);
} else {
    // Si no hay tema guardado, aplicar el rosa por defecto
    aplicarTema('rosa');
}

// ==========================================
// 5. ANIMACIONES DE FONDO SEGÚN TEMA
// ==========================================
const contenedorAnimaciones = document.getElementById('animaciones-fondo');
let intervaloAnimaciones;

// Función para limpiar las animaciones anteriores
function limpiarAnimaciones() {
    contenedorAnimaciones.innerHTML = '';
    if (intervaloAnimaciones) {
        clearInterval(intervaloAnimaciones);
    }
}

// Función para crear una partícula
function crearParticula(tipo) {
    const particula = document.createElement('div');
    particula.classList.add('particula', tipo);
    
    // Posición horizontal aleatoria
    particula.style.left = Math.random() * 100 + '%';
    
    // Duración aleatoria
    const duracion = Math.random() * 5 + 5; // Entre 5 y 10 segundos
    particula.style.animationDuration = duracion + 's';
    
    // Delay aleatorio
    particula.style.animationDelay = Math.random() * 2 + 's';
    
    // Tamaño aleatorio usando scale en un wrapper (no sobrescribe la animación)
    if (tipo === 'petalo') {
        const escala = Math.random() * 0.5 + 0.7; // Entre 0.7 y 1.2
        particula.style.width = (20 * escala) + 'px';
        particula.style.height = (20 * escala) + 'px';
    } else if (tipo === 'copo-nieve') {
        const escala = Math.random() * 0.8 + 0.6; // Entre 0.6 y 1.4
        particula.style.width = (8 * escala) + 'px';
        particula.style.height = (8 * escala) + 'px';
    } else if (tipo === 'estrella') {
        const escala = Math.random() * 1 + 0.5; // Entre 0.5 y 1.5
        particula.style.width = (4 * escala) + 'px';
        particula.style.height = (4 * escala) + 'px';
    }
    
    contenedorAnimaciones.appendChild(particula);
    
    // Eliminar la partícula después de que termine su animación
    setTimeout(() => {
        if (particula.parentNode) {
            particula.parentNode.removeChild(particula);
        }
    }, (duracion + 2) * 1000);
}

// Función para iniciar animaciones según el tema
function iniciarAnimaciones(tema) {
    limpiarAnimaciones();
    
    const temasClaros = ['rosa', 'violeta-claro', 'durazno'];
    const temasOscuros = ['violeta-oscuro', 'burgundy', 'azul-noche'];
    
    if (temasClaros.includes(tema)) {
        // Animaciones para temas claros: solo pétalos
        intervaloAnimaciones = setInterval(() => {
            crearParticula('petalo');
        }, 500); // Un pétalo cada 500ms
        
        // Crear algunas partículas iniciales
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                crearParticula('petalo');
            }, i * 200);
        }
        
    } else if (temasOscuros.includes(tema)) {
        // Animaciones para temas oscuros: copos de nieve, estrellas y partículas mágicas
        intervaloAnimaciones = setInterval(() => {
            const rand = Math.random();
            if (rand > 0.6) {
                crearParticula('copo-nieve');
            } else if (rand > 0.3) {
                crearParticula('estrella');
            } else {
                crearParticula('particula-magica');
            }
        }, 400); // Una partícula cada 400ms
        
        // Crear algunas partículas iniciales
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const rand = Math.random();
                if (rand > 0.6) {
                    crearParticula('copo-nieve');
                } else if (rand > 0.3) {
                    crearParticula('estrella');
                } else {
                    crearParticula('particula-magica');
                }
            }, i * 150);
        }
    }
}

// Modificar la función aplicarTema para incluir las animaciones
const aplicarTemaOriginal = aplicarTema;
aplicarTema = function(nombreTema) {
    aplicarTemaOriginal(nombreTema);
    iniciarAnimaciones(nombreTema);
};

// Iniciar animaciones con el tema actual al cargar
const temaInicial = localStorage.getItem('tema-preferido') || 'rosa';
iniciarAnimaciones(temaInicial);