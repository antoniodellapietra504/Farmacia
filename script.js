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

// --- Slider "Chi Siamo: anteprime strette, opacità da scroll, easing su click ---
const sliderWrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slider-wrapper .slide');
const dots = document.querySelectorAll('.dot');

if (sliderWrapper && slides.length > 0) {
  let scrollRaf = null;
  let animRaf = null;

  function easeOutQuint(t) {
    return 1 - (1 - t) ** 5;
  }

  function getNearestSlideIndex() {
    const viewMid = sliderWrapper.scrollLeft + sliderWrapper.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const mid = slide.offsetLeft + slide.offsetWidth / 2;
      const d = Math.abs(mid - viewMid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }

  function getScrollLeftForIndex(index) {
    const slide = slides[index];
    if (!slide) return 0;
    const target =
      slide.offsetLeft + slide.offsetWidth / 2 - sliderWrapper.clientWidth / 2;
    const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
    return Math.max(0, Math.min(target, maxScroll));
  }

  function updateSlideVisuals() {
    const viewMid = sliderWrapper.scrollLeft + sliderWrapper.clientWidth / 2;
    const metrics = [];
    slides.forEach((slide) => {
      metrics.push({
        mid: slide.offsetLeft + slide.offsetWidth / 2,
        w: slide.offsetWidth
      });
    });

    let bestI = 0;
    let bestFocus = -1;
    const focuses = [];

    metrics.forEach((m, i) => {
      const dist = Math.abs(m.mid - viewMid);
      const range = Math.max(m.w * 0.52, 1);
      let focus = Math.max(0, Math.min(1, 1 - dist / range));
      focus *= focus;
      focuses.push(focus);
      if (focus > bestFocus) {
        bestFocus = focus;
        bestI = i;
      }
    });

    slides.forEach((slide, i) => {
      slide.style.setProperty('--slide-focus', focuses[i].toFixed(4));
      slide.classList.toggle('is-active', i === bestI);
      slide.classList.toggle('is-prev', i === bestI - 1);
      slide.classList.toggle('is-next', i === bestI + 1);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === bestI);
    });
  }

  function scheduleVisualUpdate() {
    if (scrollRaf != null) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null;
      updateSlideVisuals();
    });
  }

  function scrollToIndexInstant(index) {
    sliderWrapper.scrollLeft = getScrollLeftForIndex(index);
    updateSlideVisuals();
  }

  function animateToIndex(index, duration = 680) {
    if (animRaf != null) cancelAnimationFrame(animRaf);
    const target = getScrollLeftForIndex(index);
    const start = sliderWrapper.scrollLeft;
    const delta = target - start;
    if (Math.abs(delta) < 1) {
      updateSlideVisuals();
      return;
    }

    sliderWrapper.classList.add('slider-no-snap');
    const t0 = performance.now();

    function finish() {
      animRaf = null;
      sliderWrapper.scrollLeft = target;
      updateSlideVisuals();
      requestAnimationFrame(() => {
        sliderWrapper.classList.remove('slider-no-snap');
      });
    }

    function step(now) {
      const elapsed = now - t0;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutQuint(t);
      sliderWrapper.scrollLeft = start + delta * eased;
      updateSlideVisuals();
      if (t < 1) {
        animRaf = requestAnimationFrame(step);
      } else {
        finish();
      }
    }

    animRaf = requestAnimationFrame(step);
  }

  function goToSlide(index) {
    animateToIndex(index, 680);
  }

  sliderWrapper.addEventListener('scroll', scheduleVisualUpdate, { passive: true });

  sliderWrapper.addEventListener(
    'pointerdown',
    () => {
      if (animRaf == null) return;
      cancelAnimationFrame(animRaf);
      animRaf = null;
      sliderWrapper.classList.remove('slider-no-snap');
    },
    { passive: true }
  );

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => goToSlide(index));
  });

  window.addEventListener('resize', () => {
    if (animRaf != null) {
      cancelAnimationFrame(animRaf);
      animRaf = null;
    }
    sliderWrapper.classList.remove('slider-no-snap');
    const idx = getNearestSlideIndex();
    requestAnimationFrame(() => {
      scrollToIndexInstant(idx);
    });
  });

  requestAnimationFrame(() => {
    scrollToIndexInstant(0);
  });
}

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