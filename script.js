const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar'); // Seleziona la navbar

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

