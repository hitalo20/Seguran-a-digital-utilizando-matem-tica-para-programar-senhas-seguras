// ===== ELEMENTOS =====
const lengthSlider = document.getElementById('lengthSlider');
const lengthDisplay = document.getElementById('lengthDisplay');
const gerarBtn = document.getElementById('gerarBtn');
const senhaDisplay = document.getElementById('senhaGerada');
const combinacoesSpan = document.getElementById('combinacoes');
const entropiaSpan = document.getElementById('entropia');
const copiarBtn = document.getElementById('copiarBtn');
const feedback = document.getElementById('feedback');

// checkboxes
const chkMaiusculas = document.getElementById('chkMaiusculas');
const chkMinusculas = document.getElementById('chkMinusculas');
const chkNumeros = document.getElementById('chkNumeros');
const chkSimbolos = document.getElementById('chkSimbolos');

// ===== CONJUNTOS =====
const MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
const NUMEROS = '0123456789';
const SIMBOLOS = '!@#$%&*()_+-=<>?';

// ===== ATUALIZA DISPLAY DO COMPRIMENTO =====
lengthSlider.addEventListener('input', () => {
    lengthDisplay.textContent = lengthSlider.value;
});

// ===== FUNÇÃO PARA GERAR SENHA =====
function gerarSenha() {
    // 1. Montar alfabeto conforme checkboxes
    let alfabeto = '';
    if (chkMaiusculas.checked) alfabeto += MAIUSCULAS;
    if (chkMinusculas.checked) alfabeto += MINUSCULAS;
    if (chkNumeros.checked) alfabeto += NUMEROS;
    if (chkSimbolos.checked) alfabeto += SIMBOLOS;

    // validação: pelo menos um conjunto marcado
    if (alfabeto.length === 0) {
        feedback.textContent = '⚠️ Selecione pelo menos um tipo de caractere!';
        feedback.style.color = '#b13e3e';
        senhaDisplay.textContent = '❌';
        combinacoesSpan.textContent = 'combinações: —';
        entropiaSpan.textContent = 'entropia: — bits';
        return;
    }

    const comprimento = parseInt(lengthSlider.value, 10);
    const m = alfabeto.length;          // tamanho do alfabeto
    const k = comprimento;              // comprimento da senha

    // 2. Gerar senha aleatória
    let senha = '';
    for (let i = 0; i < k; i++) {
        const indice = Math.floor(Math.random() * m);
        senha += alfabeto[indice];
    }

    senhaDisplay.textContent = senha;

    // 3. Calcular combinações N = m^k (usando BigInt para números grandes)
    let combinacoes;
    if (m === 0) {
        combinacoes = 0;
    } else {
        combinacoes = BigInt(m) ** BigInt(k);
    }

    // 4. Entropia H = log2(N) = k * log2(m)
    let entropia = 0;
    if (m > 1) {
        entropia = k * Math.log2(m);
    }

    // 5. Exibir com formatação amigável
    let combinacoesStr;
    if (combinacoes === 0) {
        combinacoesStr = '0';
    } else if (combinacoes > 10 ** 30) {
        // notação científica para números gigantes
        const exp = Math.floor(Math.log10(Number(combinacoes)));
        const mantissa = Number(combinacoes) / (10 ** exp);
        combinacoesStr = `${mantissa.toFixed(2)} × 10^${exp}`;
    } else {
        combinacoesStr = combinacoes.toLocaleString();
    }

    combinacoesSpan.textContent = `combinações: ${combinacoesStr}`;
    entropiaSpan.textContent = `entropia: ${entropia.toFixed(1)} bits`;

    // feedback positivo
    feedback.textContent = '✅ Senha gerada com sucesso!';
    feedback.style.color = '#2d4a1e';

    // limpa mensagem de erro se houver
    if (feedback.textContent.includes('Selecione')) {
        feedback.textContent = '✅ Senha gerada com sucesso!';
        feedback.style.color = '#2d4a1e';
    }
}

// ===== GERAR AO CLICAR =====
gerarBtn.addEventListener('click', gerarSenha);

// ===== COPIAR SENHA =====
copiarBtn.addEventListener('click', () => {
    const senha = senhaDisplay.textContent;
    if (!senha || senha === 'Clique em gerar' || senha === '❌') {
        feedback.textContent = '⚠️ Gere uma senha primeiro!';
        feedback.style.color = '#b13e3e';
        return;
    }

    navigator.clipboard.writeText(senha)
        .then(() => {
            feedback.textContent = '📋 Senha copiada para a área de transferência!';
            feedback.style.color = '#2d4a1e';
        })
        .catch(() => {
            feedback.textContent = '❌ Erro ao copiar. Tente manualmente.';
            feedback.style.color = '#b13e3e';
        });
});

// ===== GERAR UMA SENHA INICIAL AO CARREGAR =====
window.addEventListener('load', () => {
    // define um comprimento padrão (já está no slider)
    gerarSenha();
});
