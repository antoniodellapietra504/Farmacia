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