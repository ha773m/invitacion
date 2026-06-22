// ==========================================================================
// 1. CONTROL DE LA EXPERIENCIA DE ENTRADA (LOADER Y BIENVENIDA)
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('premium-loader');
    const btnDiscover = document.getElementById('btn-discover');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const musicFab = document.getElementById('music-control');
    const bgMusic = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');

    // Desvanecer el loader cuando todo esté listo en el navegador
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 3000);

    // Acción al presionar el botón "Descubrir Invitación"
    if (btnDiscover) {
        btnDiscover.addEventListener('click', () => {
            // 1. Intentar reproducir música automáticamente al interactuar
            if (bgMusic) {
                bgMusic.play().then(() => {
                    musicFab.classList.add('playing');
                }).catch(error => {
                    console.log("La política del navegador bloqueó el autoplay inicial:", error);
                });
            }

            // 2. Desplazar la pantalla de bienvenida hacia arriba (Efecto Telón)
            if (welcomeScreen) {
                welcomeScreen.style.transform = 'translateY(-100vh)';
            }

            // 3. Quitar el desenfoque y habilitar el scroll en el contenido principal
            if (mainContent) {
                mainContent.classList.remove('content-hidden');
            }

            // 4. Mostrar el botón flotante de control musical
            if (musicFab) {
                musicFab.classList.remove('hidden');
            }
        });
    }

    // CONTROL DEL BOTÓN FLOTANTE DE MÚSICA (FAB)
    if (musicFab && bgMusic) {
        musicFab.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicFab.classList.add('playing');
                musicIcon.className = "fa-solid fa-music";
            } else {
                bgMusic.pause();
                musicFab.classList.remove('playing');
                musicIcon.className = "fa-solid fa-volume-xmark";
            }
        });
    }
});

// ==========================================================================
// 2. LÓGICA REFINADA DEL CARRUSEL DE MEMORIAS
// ==========================================================================

const indicadores = document.querySelectorAll(".indicadores span");
const fotos = [
    "img/portada.jpeg",
    "img/foto2.jpeg",
    "img/foto3.jpeg",
    "img/foto4.jpeg",
    "img/foto5.jpeg",
    "img/foto6.jpeg",
    "img/foto7.jpeg"
];

let fotoActual = 0;
const imagen = document.getElementById("fotoCarrusel");

if (imagen) {
    imagen.style.transition = "opacity .35s ease-in-out";
}

function mostrarFoto() {
    if (!imagen) return;
    
    // Transición suave de fundido (fade out)
    imagen.style.opacity = "0";

    setTimeout(() => {
        imagen.src = fotos[fotoActual];
        imagen.style.opacity = "1"; // Fade in
    }, 350);

    // Actualizar los puntos indicadores
    indicadores.forEach(i => i.classList.remove("activo"));
    if (indicadores[fotoActual]) {
        indicadores[fotoActual].classList.add("activo");
    }
}

function siguiente() {
    fotoActual++;
    if (fotoActual >= fotos.length) {
        fotoActual = 0;
    }
    mostrarFoto();
    reiniciarAutoPlay();
}

function anterior() {
    fotoActual--;
    if (fotoActual < 0) {
        fotoActual = fotos.length - 1;
    }
    mostrarFoto();
    reiniciarAutoPlay();
}

// Inicializar el Autoplay
let autoplay = setInterval(() => {
    fotoActual++;
    if (fotoActual >= fotos.length) {
        fotoActual = 0;
    }
    mostrarFoto();
}, 5000);

function reiniciarAutoPlay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
        fotoActual++;
        if (fotoActual >= fotos.length) {
            fotoActual = 0;
        }
        mostrarFoto();
    }, 5000);
}

// ==========================================================================
// 3. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================================================

const elementosReveal = document.querySelectorAll(".scroll-reveal");

const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            // Opcional: dejar de observar si solo queremos que se anime la primera vez
            // observador.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12, // Se activa cuando el 12% de la sección entra en pantalla
    rootMargin: "0px 0px -50px 0px"
});

elementosReveal.forEach(elemento => {
    observador.observe(elemento);
});

// ==========================================================================
// 4. CUENTA REGRESIVA DE ALTA PRECISIÓN
// ==========================================================================

const fechaEvento = new Date("July 15, 2026 17:00:00").getTime();

const x = setInterval(() => {
    const ahora = new Date().getTime();
    const diferencia = fechaEvento - ahora;

    // Si la fecha ya pasó, dejar los marcadores en 0
    if (diferencia < 0) {
        clearInterval(x);
        document.getElementById("dias").textContent = "0";
        document.getElementById("horas").textContent = "0";
        document.getElementById("minutos").textContent = "0";
        document.getElementById("segundos").textContent = "0";
        return;
    }

    // Cálculos de tiempo para días, horas, minutos y segundos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    // Inyectar los valores en el HTML de forma segura
    const elDias = document.getElementById("dias");
    const elHoras = document.getElementById("horas");
    const elMinutos = document.getElementById("minutos");
    const elSegundos = document.getElementById("segundos");

    if (elDias) elDias.textContent = dias;
    if (elHoras) elHoras.textContent = horas;
    if (elMinutos) elMinutos.textContent = minutos;
    if (elSegundos) elSegundos.textContent = segundos;
}, 1000);
