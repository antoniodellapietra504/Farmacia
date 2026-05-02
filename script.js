const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar'); // Seleziona la navbar

//Transizioni
document.addEventListener("DOMContentLoaded", function() {
  const elements = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Rimuovi il commento (le due sbarrette) dalla riga sotto se vuoi che l'animazione avvenga una volta sola
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15 // Si attiva quando il 15% dell'elemento entra nello schermo
  });

  elements.forEach(element => {
    observer.observe(element);
  });
});

// Toggle Menu
menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
    navbar.classList.toggle('nav-active'); // Aggiunge lo stato alla navbar per cambiare logo/scritta
    
    if (menuLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Sblocca le animazioni :active sui dispositivi touch (iOS/Android)
document.addEventListener("touchstart", function() {}, {passive: true});

// Chiude il menu quando si clicca su un link
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
    navbar.classList.remove('nav-active');
    document.body.style.overflow = 'auto';
}));

// Logica per lo slider "Chi Siamo"
const wrapper = document.querySelector('.slider-wrapper');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

function updateSlider(index) {
    // Sposta il wrapper orizzontalmente del 33.33% per ogni slide
    wrapper.style.transform = `translateX(-${index * 33.333}%)`;
    
    // Aggiorna i puntini
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// Funzione per andare alla prossima slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % 3; // Ricomincia dopo la terza foto
    updateSlider(currentIndex);
}

// Cambio automatico ogni 4 secondi
setInterval(nextSlide, 3000);

// Opzionale: Clic sui puntini per cambiare foto
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider(currentIndex);
    });
});

// =========================================
// GESTIONE COOKIE BANNER & GOOGLE MAPS (REVERSIBILE)
// =========================================
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');
const rejectBtn = document.getElementById('reject-cookies');
const mapContainer = document.getElementById('map-container');

// Salviamo il contenuto originale del placeholder per poterlo ripristinare
const mapPlaceholderHTML = `
    <div class="map-placeholder">
        <p>Accetta i cookie di terze parti per visualizzare la mappa interattiva di Google Maps.</p>
        <button id="accept-map-cookies" class="btn-primary" style="margin-top: 15px; font-size: 0.9rem; padding: 8px 20px;">Accetta e Mostra Mappa</button>
    </div>
`;

// Funzione per caricare la mappa
function loadGoogleMaps() {
    if (mapContainer) {
        mapContainer.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3016.54!2d14.52!3d40.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDU1JzI0LjAiTiAxNMKwMzEnMTIuMCJF!5e0!3m2!1sit!2sit!4v1234567890" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    }
}

// Funzione per rimuovere la mappa e ripristinare il placeholder
function removeGoogleMaps() {
    if (mapContainer) {
        mapContainer.innerHTML = mapPlaceholderHTML;
        // Essendo il bottone nuovo (creato via innerHTML), dobbiamo riattaccare il listener
        attachMapBtnListener();
    }
}

// Funzione per gestire il click sul bottone "Accetta e Mostra Mappa" dentro il riquadro
function attachMapBtnListener() {
    const acceptMapBtn = document.getElementById('accept-map-cookies');
    if (acceptMapBtn) {
        acceptMapBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
            loadGoogleMaps();
        });
    }
}

// Controllo iniziale
if (localStorage.getItem('cookieConsent') === 'accepted') {
    loadGoogleMaps();
} else if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => { cookieBanner.classList.add('show'); }, 1000);
}

// TASTO ACCETTA TUTTI (dal banner)
acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('show');
    loadGoogleMaps();
});

// TASTO RIFIUTA (dal banner) - ORA OSCURA LA MAPPA
rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    cookieBanner.classList.remove('show');
    removeGoogleMaps(); // <--- Questa è la riga fondamentale che oscura la mappa
});

// RIAPRI BANNER DAL FOOTER
const reopenCookieBtn = document.getElementById('reopen-cookie-banner');
if (reopenCookieBtn) {
    reopenCookieBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cookieBanner.classList.add('show');
    });
}

// Inizializza il listener per il bottone della mappa al caricamento
attachMapBtnListener();