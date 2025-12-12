const bolas = document.querySelectorAll('.bola');
const btnGerar = document.getElementById('btnGerar');
const mensagem = document.getElementById('mensagem');
const btnCopiar = document.getElementById('btnCopiar');

let numerosSorteados = [];

function gerarNumerosUnicos() {
    const numeros = new Set();

    while (numeros.size < 6) {
        const numero = Math.floor(Math.random() * 60) + 1;
        numeros.add(numero);
    }

    return Array.from(numeros).sort((a, b) => a - b);
}

function formatarNumero(num) {
    return num.toString().padStart(2, '0');
}

function animarRolagem(bolaElement) {
    return new Promise(resolve => {
        bolaElement.classList.add('rolando');

        let contador = 0;

        const intervalo = setInterval(() => {
            const numTemp = Math.floor(Math.random() * 60) + 1;
            bolaElement.textContent = formatarNumero(numTemp);
            contador++;

            if (contador >= 8) {
                clearInterval(intervalo);
                bolaElement.classList.remove('rolando');
                resolve();
            }
        }, 60);
    });
}

function revelarNumero(bolaElement, numero) {
    return new Promise(resolve => {
        bolaElement.classList.remove('vazia');
        bolaElement.classList.add('revelando');
        bolaElement.textContent = formatarNumero(numero);
        bolaElement.style.background = 'linear-gradient(145deg, #5fd68a, #209869)';
        bolaElement.style.border = '4px solid #209869';
        
        setTimeout(() => {
            bolaElement.classList.remove('revelando');
            resolve();
        }, 600);
    });
}

function criarConfete() {
    const cores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confete = document.createElement('div');
            confete.className = 'confete';
            confete.style.left = Math.random() * 100 + '%';
            confete.style.top = '-10px';
            confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
            confete.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confete);
            setTimeout(() => confete.remove(), 3000);
        }, i * 50);
    }
}

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
    mensagem.classList.add('visivel');

    setTimeout(() => {
        mensagem.classList.remove('visivel');
    }, 2000);
}

async function sortear() {
    btnGerar.disabled = true;
    btnGerar.textContent = 'Sorteando…';
    btnCopiar.disabled = true;

    bolas.forEach(bola => {
        bola.classList.add('vazia');
        bola.textContent = '?';
        bola.style.background = '#f8f9fa';
        bola.style.border = '4px solid #e0e0e0';
    });

    numerosSorteados = gerarNumerosUnicos();

    for (let i = 0; i < bolas.length; i++) {
        const bola = bolas[i];
        const numero = numerosSorteados[i];
        await animarRolagem(bola);
        await new Promise(resolve => setTimeout(resolve, 100));
        await revelarNumero(bola, numero);
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    criarConfete();

    btnGerar.disabled = false;
    btnGerar.textContent = 'Sortear';
    btnCopiar.disabled = false;
}

async function copiarNumeros() {
    if (numerosSorteados.length === 0) return;

    const texto = numerosSorteados.map(formatarNumero).join(' - ');

    try {
        await navigator.clipboard.writeText(texto);
        mostrarMensagem('📋 Números copiados!');
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            mostrarMensagem('📋 Números copiados!');
        } catch (e) {
            mostrarMensagem('❌ Erro ao copiar');
        }
        
        document.body.removeChild(textArea);
    }
}

btnGerar.addEventListener('click', sortear);
btnCopiar.addEventListener('click', copiarNumeros);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === btnGerar && !btnGerar.disabled) {
        sortear();
    }
    if (e.key === 'Enter' && document.activeElement === btnCopiar && !btnCopiar.disabled) {
        copiarNumeros();
    }
});