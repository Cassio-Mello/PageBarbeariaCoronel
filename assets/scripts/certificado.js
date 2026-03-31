const SENHA_SISTEMA = 'coronel2016@';

const senhaSection = document.getElementById('senha-section');
const studioSection = document.getElementById('certificado-section');
const senhaInput = document.getElementById('senhaInput');
const verificarSenhaButton = document.getElementById('verificarSenha');
const certificadoForm = document.getElementById('certificadoForm');
const baixarCertificadoButton = document.getElementById('baixarCertificado');
const nomeInput = document.getElementById('nome');
const dataInput = document.getElementById('data');
const temaInput = document.getElementById('tema');
const fraseInput = document.getElementById('frase');
const fotoInput = document.getElementById('foto');
const certNome = document.getElementById('certNome');
const certData = document.getElementById('certData');
const certFrase = document.getElementById('certFrase');
const certFoto = document.getElementById('certFoto');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const certificado = document.getElementById('certificado');

const THEME_CLASSNAMES = ['theme-classic', 'theme-fun', 'theme-soft', 'theme-easter', 'theme-christmas'];
const DEFAULT_PHRASE = 'Estilo de gente grande com clima de infancia.';
let currentPhotoLoadPromise = Promise.resolve();

function setTodayAsDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dataInput.value = `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
    if (!dateValue) return '__/__/____';

    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
}

function sanitizeName(name) {
    if (!name) return 'Nome da crianca';
    return name.trim().slice(0, 30);
}

function sanitizePhrase(phrase) {
    if (!phrase || !phrase.trim()) return DEFAULT_PHRASE;
    return phrase.trim().slice(0, 90);
}

function updateTextPreview() {
    const safeName = sanitizeName(nomeInput.value);
    const safeDate = formatDate(dataInput.value);
    const safePhrase = sanitizePhrase(fraseInput.value);

    certNome.textContent = safeName;
    certData.textContent = safeDate;
    certFrase.textContent = safePhrase;
}

function updateThemePreview() {
    const selectedTheme = `theme-${temaInput.value}`;

    THEME_CLASSNAMES.forEach(className => {
        certificado.classList.remove(className);
    });

    certificado.classList.add(selectedTheme);
}

function updatePhotoPreview() {
    const file = fotoInput.files[0];

    if (!file) {
        certFoto.removeAttribute('src');
        certFoto.style.display = 'none';
        photoPlaceholder.hidden = false;
        currentPhotoLoadPromise = Promise.resolve();
        return;
    }

    const reader = new FileReader();

    currentPhotoLoadPromise = new Promise(resolve => {
        reader.onload = event => {
            certFoto.src = event.target.result;
            certFoto.style.display = 'block';
            photoPlaceholder.hidden = true;
            resolve();
        };
    });

    reader.readAsDataURL(file);
}

function unlockStudio() {
    senhaSection.hidden = true;
    studioSection.hidden = false;
    nomeInput.focus();
}

function validatePassword() {
    const senhaDigitada = senhaInput.value.trim();

    if (senhaDigitada !== SENHA_SISTEMA) {
        alert('Senha incorreta. Tente novamente.');
        senhaInput.focus();
        senhaInput.select();
        return;
    }

    unlockStudio();
}

function handleGeneratePost(event) {
    event.preventDefault();

    if (!fotoInput.files[0]) {
        alert('Selecione a foto da crianca para gerar o post.');
        fotoInput.focus();
        return;
    }

    updateTextPreview();
    updateThemePreview();
    updatePhotoPreview();
    baixarCertificadoButton.disabled = false;
}

function createFileName(prefix) {
    const fileName = sanitizeName(nomeInput.value)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    return `${prefix}-${fileName || 'barbearia-coronel'}.png`;
}

async function downloadElementAsImage(element, fileName) {
    updateTextPreview();
    updateThemePreview();
    await currentPhotoLoadPromise;

    const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#fff8ef'
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function downloadPostImage() {
    return downloadElementAsImage(certificado, createFileName('primeiro-corte-post'));
}

function init() {
    setTodayAsDefaultDate();
    updateTextPreview();
    updateThemePreview();

    verificarSenhaButton.addEventListener('click', validatePassword);

    senhaInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            validatePassword();
        }
    });

    certificadoForm.addEventListener('submit', handleGeneratePost);
    baixarCertificadoButton.addEventListener('click', downloadPostImage);

    nomeInput.addEventListener('input', updateTextPreview);
    dataInput.addEventListener('change', updateTextPreview);
    temaInput.addEventListener('change', updateThemePreview);
    fraseInput.addEventListener('input', updateTextPreview);
    fotoInput.addEventListener('change', updatePhotoPreview);
}

document.addEventListener('DOMContentLoaded', init);
