document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. REFERENCIAS AL DOM (Todas al principio)
    // ==========================================
    const fraseEl = document.getElementById('frase');
    const reproductorTituloEl = document.getElementById('reproductor-titulo');
    const audioVoz = document.getElementById('audio-voz');
    const audioMusica = document.getElementById('audio-musica');
    const barraProgreso = document.getElementById('barra-progreso');
    const tiempoActualEl = document.getElementById('tiempo-actual');
    const btnPlay = document.getElementById('btn-play');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const barraContenedor = document.querySelector('.barra-progreso-contenedor');
    const tiempoTotalEl = document.getElementById('tiempo-total');
    const btnVoz = document.getElementById('btn-voz');
    const contenedorAnimaciones = document.getElementById('animaciones-fondo');
    const botonesTema = document.querySelectorAll('.btn-tema');
    const fabBtn = document.getElementById('fab-btn');
    const fabMenu = document.getElementById('fab-menu');
    const reproductorMini = document.getElementById('reproductor-mini');
    const miniPlay = document.getElementById('mini-play');
    const miniTitulo = document.getElementById('mini-titulo');
    const miniBarraProgreso = document.getElementById('mini-barra-progreso');

    // ==========================================
    // 2. ESTADO Y DATOS
    // ==========================================
    const hoy = new Date();
    const inicioAno = new Date(hoy.getFullYear(), 0, 0);
    const diaDelAno = Math.floor((hoy - inicioAno) / (1000 * 60 * 60 * 24));
    let indiceActual = diaDelAno % contenidoDiario.length;

    const fechaInicio = new Date(2023, 0, 1); // ⚠️ CAMBIA ESTA FECHA
    let intervaloAnimaciones = null;
    const temasDisponibles = ['rosa', 'violeta-claro', 'durazno', 'violeta-oscuro', 'burgundy', 'azul-noche'];

    // ==========================================
    // 3. FUNCIONES
    // ==========================================
    function formatearTiempo(segundos) {
        if (isNaN(segundos)) return '0:00';
        const m = Math.floor(segundos / 60);
        const s = Math.floor(segundos % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function actualizarMini() {
        if (miniTitulo && miniBarraProgreso && miniPlay && reproductorTituloEl && barraProgreso && btnPlay) {
            miniTitulo.innerText = reproductorTituloEl.innerText;
            miniBarraProgreso.style.width = barraProgreso.style.width;
            miniPlay.innerText = btnPlay.innerText;
        }
    }

    function cargarContenido(indice) {
        const contenido = contenidoDiario[indice];
        if (fraseEl) fraseEl.innerText = `"${contenido.frase}"`;
        if (reproductorTituloEl) reproductorTituloEl.innerText = contenido.titulo;
        
        if (audioVoz) audioVoz.src = contenido.voz;
        if (audioMusica) {
            audioMusica.src = contenido.musica;
            audioMusica.load();
        }

        if (barraProgreso) barraProgreso.style.width = '0%';
        if (tiempoActualEl) tiempoActualEl.innerText = '0:00';
        if (btnPlay) btnPlay.innerText = '▶';
        
        setTimeout(actualizarMini, 100);
    }

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

    function limpiarAnimaciones() {
        if (contenedorAnimaciones) contenedorAnimaciones.innerHTML = '';
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
            if (p && p.parentNode) p.parentNode.removeChild(p);
        }, (duracion + 3) * 1000);
    }

    function iniciarAnimaciones(tema) {
        limpiarAnimaciones();
        const temasClaros = ['rosa', 'violeta-claro', 'durazno'];

        if (temasClaros.includes(tema)) {
            intervaloAnimaciones = setInterval(() => crearParticula('petalo'), 600);
            for (let i = 0; i < 10; i++) setTimeout(() => crearParticula('petalo'), i * 200);
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

    function aplicarTema(nombreTema) {
        temasDisponibles.forEach(t => document.body.classList.remove(`tema-${t}`));
        document.body.classList.add(`tema-${nombreTema}`);
        localStorage.setItem('tema-preferido', nombreTema);
        iniciarAnimaciones(nombreTema);
    }

    // ==========================================
    // 4. INICIALIZACIÓN Y EVENT LISTENERS
    // ==========================================
    
    // Cargar contenido inicial
    cargarContenido(indiceActual);
    
    // Contador
    setInterval(actualizarContador, 1000);
    actualizarContador();

    // Reproductor Música
    if (btnPlay && audioMusica) {
        btnPlay.addEventListener('click', () => {
            if (audioMusica.paused) {
                audioMusica.play();
                btnPlay.innerText = '⏸';
            } else {
                audioMusica.pause();
                btnPlay.innerText = '▶';
            }
        });
    }

    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            indiceActual = (indiceActual - 1 + contenidoDiario.length) % contenidoDiario.length;
            cargarContenido(indiceActual);
        });
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => {
            indiceActual = (indiceActual + 1) % contenidoDiario.length;
            cargarContenido(indiceActual);
        });
    }

    if (audioMusica) {
        audioMusica.addEventListener('timeupdate', () => {
            if (audioMusica.duration && barraProgreso && tiempoActualEl) {
                const progreso = (audioMusica.currentTime / audioMusica.duration) * 100;
                barraProgreso.style.width = progreso + '%';
                tiempoActualEl.innerText = formatearTiempo(audioMusica.currentTime);
            }
        });

        audioMusica.addEventListener('loadedmetadata', () => {
            if (tiempoTotalEl) tiempoTotalEl.innerText = formatearTiempo(audioMusica.duration);
        });

        audioMusica.addEventListener('ended', () => {
            if (btnPlay && barraProgreso) {
                btnPlay.innerText = '▶';
                barraProgreso.style.width = '0%';
            }
        });
    }

    if (barraContenedor && audioMusica) {
        barraContenedor.addEventListener('click', (e) => {
            if (audioMusica.duration) {
                const rect = barraContenedor.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const porcentaje = clickX / rect.width;
                audioMusica.currentTime = porcentaje * audioMusica.duration;
            }
        });
    }

    // Botón de Voz
    if (btnVoz && audioVoz) {
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
    }

    // Selector de Temas
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

    // FAB Menú
    if (fabBtn && fabMenu) {
        fabBtn.addEventListener('click', () => {
            fabMenu.classList.toggle('abierto');
            fabBtn.classList.toggle('activo');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.fab-temas')) {
                fabMenu.classList.remove('abierto');
                fabBtn.classList.remove('activo');
            }
        });

        document.querySelectorAll('.fab-menu .btn-tema').forEach(boton => {
            boton.addEventListener('click', () => {
                setTimeout(() => {
                    fabMenu.classList.remove('abierto');
                    fabBtn.classList.remove('activo');
                }, 300);
            });
        });
    }

    // Reproductor Mini
    if (miniPlay && btnPlay) {
        miniPlay.addEventListener('click', (e) => {
            e.stopPropagation();
            btnPlay.click();
        });
    }
});