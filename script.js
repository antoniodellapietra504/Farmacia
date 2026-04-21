const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

// Toggle del menu mobile
menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// Chiude il menu quando si clicca su un link (opzionale ma consigliato)
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
}));

const wrapper = document.querySelector('.slider-wrapper');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentIndex = 1; // Partiamo dalla 1 (non dalla 0 che è il clone)
const totalImages = 3; 

function updateSlider(transition = true) {
    if (transition) {
        wrapper.style.transition = "transform 0.5s ease-in-out";
    } else {
        wrapper.style.transition = "none";
    }

    // Calcolo per centrare la slide:
    // Spostiamo il wrapper in base alla larghezza della slide (80%) + i margini
    // L'offset del -2.5% serve a compensare la centratura visiva
    const offset = -currentIndex * 80 - (currentIndex * 5) + 7.5; 
    wrapper.style.transform = `translateX(${offset}%)`;

    // Gestione classi active
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentIndex) slide.classList.add('active');
    });

    // Gestione pallini (i pallini sono solo 3)
    let dotIndex = currentIndex - 1;
    if (currentIndex === 0) dotIndex = 2;
    if (currentIndex === 4) dotIndex = 0;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === dotIndex);
    });
}

function nextSlide() {
    currentIndex++;
    updateSlider();

    // Se arriviamo al clone finale, saltiamo alla prima foto reale senza animazione
    if (currentIndex === totalImages + 1) {
        setTimeout(() => {
            currentIndex = 1;
            updateSlider(false);
        }, 500);
    }
}

// Avvio automatico
setInterval(nextSlide, 4000);

// Posizionamento iniziale corretto
window.onload = () => updateSlider(false);