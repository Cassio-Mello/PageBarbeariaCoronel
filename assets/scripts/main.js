const phoneNumber = '5551996474873'
const businessHours = {
    0: null,
    1: null,
    2: { start: 8, end: 20 },
    3: { start: 8, end: 20 },
    4: { start: 8, end: 20 },
    5: { start: 8, end: 20 },
    6: { start: 8, end: 17 }
};

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

    sendToWhatsApp(name, phone, service, formatDate(date), time);
    event.target.reset();
    updateAvailableSchedules();
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
    mobileMenuBtn.setAttribute('aria-expanded', String(mobileMenu.classList.contains('active')));
    mobileMenuBtn.setAttribute(
        'aria-label',
        mobileMenu.classList.contains('active') ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
    );
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    mobileMenu.classList.remove('active');
    mobileMenuBtn.textContent = '☰';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Abrir menu de navegação');
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

function formatDate(dateValue) {
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
}

function setDateMinValue() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${year}-${month}-${day}`;
}

function createTimeOption(timeSelect, value, label, disabled = false) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.disabled = disabled;
    option.selected = disabled;
    timeSelect.appendChild(option);
}

function updateAvailableSchedules() {
    const timeSelect = document.getElementById('time');
    const dateInput = document.getElementById('date');
    if (!timeSelect || !dateInput) return;

    timeSelect.innerHTML = '';

    if (!dateInput.value) {
        createTimeOption(timeSelect, '', 'Selecione uma data primeiro', true);
        return;
    }

    const selectedDate = new Date(`${dateInput.value}T12:00:00`);
    const weekday = selectedDate.getDay();
    const schedule = businessHours[weekday];

    if (!schedule) {
        createTimeOption(timeSelect, '', 'Barbearia fechada nesta data', true);
        return;
    }

    createTimeOption(timeSelect, '', 'Selecione um horário');

    for (let h = schedule.start; h < schedule.end; h++) {
        for (const m of [0, 30]) {
            const hora = h.toString().padStart(2, '0');
            const minuto = m.toString().padStart(2, '0');
            createTimeOption(timeSelect, `${hora}:${minuto}`, `${hora}:${minuto}`);
        }
    }
}

function initGenerateSchedules() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    setDateMinValue();
    updateAvailableSchedules();
    dateInput.addEventListener('change', updateAvailableSchedules);
}

// ======== INICIALIZAÇÃO GERAL ========
function initSite() {
    initScrollAnimations();
    initBookingForm();
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initGenerateSchedules();
}

// Inicializa tudo quando a página carregar
document.addEventListener('DOMContentLoaded', initSite);
