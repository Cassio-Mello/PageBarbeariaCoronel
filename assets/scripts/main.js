const phoneNumber = '5551996474873'

// ======== ANIMAÇÃO DE SCROLL ========
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

function initScrollAnimations() {
    window.addEventListener('scroll', () => animateOnScroll());
    window.addEventListener('load', animateOnScroll);
}

// ======== FORMULÁRIO DE AGENDAMENTO ========
function sendToWhatsApp(name, phone, service, date, time) {
    const message = `Olá! Gostaria de agendar um horário:\n\n` +
                    `Nome: ${name}\n` +
                    `Telefone: ${phone}\n` +
                    `Serviço: ${service}\n` +
                    `Data: ${date}\n` +
                    `Horário: ${time}`;

    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function handleBookingFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (!name || !phone || !service || !date || !time) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    sendToWhatsApp(name, phone, service, date, time);
    event.target.reset();
}

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) form.addEventListener('submit', handleBookingFormSubmit);
}

// ======== MENU MOBILE ========
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    mobileMenu.classList.toggle('active');
    mobileMenuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    mobileMenu.classList.remove('active');
    mobileMenuBtn.textContent = '☰';
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// ======== NAVBAR ========
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        animateOnScroll();
    });
}

// ======== SCROLL SUAVE ========
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// Função para gerar opções de horários de 30 em 30 minutos
function initGenerateShedules() {
    const timeSelect = document.getElementById('time');
    if (!timeSelect) return; // evita erro se o elemento não existir

    const startHour = 8;  // início do expediente (08:00)
    const endHour = 20;   // fim do expediente (20:00)

    for (let h = startHour; h <= endHour; h++) {
        for (let m of [0, 30]) { // incrementa de 30 em 30 min
            const hora = h.toString().padStart(2, '0');
            const minuto = m.toString().padStart(2, '0');
            const option = document.createElement('option');
            option.value = `${hora}:${minuto}`;
            option.textContent = `${hora}:${minuto}`;
            timeSelect.appendChild(option);
        }
    }
}

// ======== INICIALIZAÇÃO GERAL ========
function initSite() {
    initScrollAnimations();
    initBookingForm();
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initGenerateShedules();
}

// Inicializa tudo quando a página carregar
document.addEventListener('DOMContentLoaded', initSite);
