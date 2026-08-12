const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar'); // Seleziona la navbar

//Transizioni
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll('.fade-in-section');
  const slideElements = document.querySelectorAll('.slide-in-left');

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

  // Osserva anche gli elementi slide-in-left
  slideElements.forEach(element => {
    observer.observe(element);
  });
});

// =========================================
// PARALLAX ONDE SVG + NAVBAR SHRINK
// =========================================
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar shrink
  if (scrollY > 30) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
}, { passive: true });

// Toggle Menu
menu.addEventListener('click', function () {
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
document.addEventListener("touchstart", function () { }, { passive: true });

// Chiude il menu quando si clicca su un link
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
  menu.classList.remove('is-active');
  menuLinks.classList.remove('active');
  navbar.classList.remove('nav-active');
  document.body.style.overflow = 'auto';
}));

// --- Sezione Chi Siamo: Animazione clip-path reveal ---
document.addEventListener("DOMContentLoaded", function () {
  const chiSiamoSection = document.getElementById('chi-siamo');

  if (chiSiamoSection) {
    const clipObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Attiva tutti gli elementi clip-reveal dentro la sezione
          chiSiamoSection.querySelectorAll('.clip-reveal').forEach(el => {
            el.classList.add('is-visible');
          });
          clipObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1 // Si attiva quando il 10% della sezione è visibile
    });

    clipObserver.observe(chiSiamoSection);
  }
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
    mapContainer.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.174080320772!2d14.358211276421287!3d40.911928825351495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133ba9dce21deb2b%3A0x57de0c0f4bd83a52!2sFarmacia%20dei%20Tigli!5e0!3m2!1sit!2sit!4v1786187012367!5m2!1sit!2sit" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
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

// =========================================
// CAROUSEL HERO SECTION
// =========================================
const track = document.getElementById('hero-carousel-track');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let totalImages = dots.length;
let autoPlayInterval;

function updateCarousel(index) {
  currentIndex = index;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  
  dots.forEach(dot => dot.classList.remove('active'));
  if(dots[currentIndex]) {
    dots[currentIndex].classList.add('active');
  }
}

function nextSlide() {
  let nextIndex = (currentIndex + 1) % totalImages;
  updateCarousel(nextIndex);
}

function startAutoPlay() {
  stopAutoPlay();
  autoPlayInterval = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    const index = parseInt(e.target.getAttribute('data-index'));
    updateCarousel(index);
    startAutoPlay();
  });
});

if (track) {
  startAutoPlay();

  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;

  track.addEventListener('mousedown', dragStart);
  track.addEventListener('touchstart', dragStart, { passive: true });

  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('touchend', dragEnd);
  track.addEventListener('mouseleave', dragEnd);

  track.addEventListener('mousemove', dragAction);
  track.addEventListener('touchmove', dragAction, { passive: true });

  function dragStart(e) {
    stopAutoPlay();
    isDragging = true;
    startPos = getPositionX(e);
    track.style.transition = 'none';
  }

  function dragAction(e) {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      const diff = currentPosition - startPos;
      
      const diffPercent = (diff / track.offsetWidth) * 100;
      const startTranslate = -(currentIndex * 100);
      currentTranslate = startTranslate + diffPercent;
      
      track.style.transform = `translateX(${currentTranslate}%)`;
    }
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.5s ease-in-out';
    
    const startTranslate = -(currentIndex * 100);
    const movedByPercent = currentTranslate - startTranslate;

    if (movedByPercent < -15 && currentIndex < totalImages - 1) {
      currentIndex += 1;
    } else if (movedByPercent > 15 && currentIndex > 0) {
      currentIndex -= 1;
    }

    updateCarousel(currentIndex);
    startAutoPlay();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }
}