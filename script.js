// ===== ELEMENTOS DO DOM =====
const lengthSlider = document.getElementById('lengthSlider');
const lengthDisplay = document.getElementById('lengthDisplay');
const gerarBtn = document.getElementById('gerarBtn');
const senhaDisplay = document.getElementById('senhaGerada');
const combinacoesSpan = document.getElementById('combinacoes');
const entropiaSpan = document.getElementById('entropia');
const copiarBtn = document.getElementById('copiarBtn');
const feedback = document.getElementById('feedback');

// Checkboxes
const chkMaiusculas = document.getElementById('chkMaiusculas');
const chkMinusculas = document.getElementById('chkMinusculas');
const chkNumeros = document.getElementById('chkNumeros');
const chkSimbolos = document.getElementById('chkSimbolos');

// ===== CONJUNTOS DE CARACTERES =====
const MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
const NUMEROS = '0123456789';
const SIMBOLOS = '!@#$%&*()_+-=<>?';

// ===== ATUALIZA DISPLAY DO COMPRIMENTO =====
lengthSlider.addEventListener('input', function() {
    lengthDisplay.textContent = this.value;
});

// ===== FUNÇÃO PRINCIPAL: GERAR SENHA =====
function gerarSenha() {
    // 1. Montar alfabeto conforme checkboxes marcados
    let alfabeto = '';
    if (chkMaiusculas.checked) alfabeto += MAIUSCULAS;
    if (chkMinusculas.checked) alfabeto += MINUSCULAS;
    if (chkNumeros.checked) alfabeto += NUMEROS;
    if (chkSimbolos.checked) alfabeto += SIMBOLOS;

    // 2. Validar se pelo menos um tipo foi selecionado
    if (alfabeto.length === 0) {
        feedback.textContent = '⚠️ Selecione pelo menos um tipo de caractere!';
        feedback.style.color = '#b13e3e';
        senhaDisplay.textContent = '❌';
        combinacoesSpan.textContent = 'combinações: —';
        entropiaSpan.textContent = 'entropia: — bits';
        return;
    }

    const comprimento = parseInt(lengthSlider.value, 10);
    const m = alfabeto.length;      // tamanho do alfabeto
    const k = comprimento;          // comprimento da senha

    // 3. Gerar senha aleatória
    let senha = '';
    for (let i = 0; i < k; i++) {
        const indice = Math.floor(Math.random() * m);
        senha += alfabeto[indice];
    }

    // 4. Exibir senha
    senhaDisplay.textContent = senha;

    // 5. Calcular combinações N = m^k usando BigInt
    let combinacoes;
    if (m === 0) {
        combinacoes = 0;
    } else {
        combinacoes = BigInt(m) ** BigInt(k);
    }

    // 6. Calcular entropia H = log2(N) = k * log2(m)
    let entropia = 0;
    if (m > 1) {
        entropia = k * Math.log2(m);
    }

    // 7. Formatar combinações para exibição
    let combinacoesStr;
    if (combinacoes === 0) {
        combinacoesStr = '0';
    } else if (combinacoes > 10 ** 30) {
        // Notação científica para números muito grandes
        const exp = Math.floor(Math.log10(Number(combinacoes)));
        const mantissa = Number(combinacoes) / (10 ** exp);
        combinacoesStr = `${mantissa.toFixed(2)} × 10^${exp}`;
    } else {
        combinacoesStr = combinacoes.toLocaleString();
    }

    // 8. Atualizar estatísticas
    combinacoesSpan.textContent = `combinações: ${combinacoesStr}`;
    entropiaSpan.textContent = `entropia: ${entropia.toFixed(1)} bits`;

    // 9. Feedback positivo
    feedback.textContent = '✅ Senha gerada com sucesso!';
    feedback.style.color = '#2d4a1e';
}

// ===== GERAR AO CLICAR NO BOTÃO =====
gerarBtn.addEventListener('click', gerarSenha);

// ===== COPIAR SENHA =====
copiarBtn.addEventListener('click', function() {
    const senha = senhaDisplay.textContent;
    
    // Validar se há uma senha válida
    if (!senha || senha === 'Clique em gerar' || senha === '❌') {
        feedback.textContent = '⚠️ Gere uma senha primeiro!';
        feedback.style.color = '#b13e3e';
        return;
    }

    // Copiar para área de transferência
    navigator.clipboard.writeText(senha)
        .then(() => {
            feedback.textContent = '📋 Senha copiada com sucesso!';
            feedback.style.color = '#2d4a1e';
        })
        .catch(() => {
            // Fallback para navegadores que não suportam clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = senha;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            feedback.textContent = '📋 Senha copiada com sucesso!';
            feedback.style.color = '#2d4a1e';
        });
});

// ===== GERAR SENHA INICIAL AO CARREGAR A PÁGINA =====
window.addEventListener('DOMContentLoaded', function() {
    gerarSenha();
});

// ===== TAMBÉM GERAR QUANDO ALTERAR O SLIDER =====
lengthSlider.addEventListener('change', gerarSenha);

// ===== GERAR QUANDO ALTERAR CHECKBOXES =====
document.querySelectorAll('.checkboxes input').forEach(function(checkbox) {
    checkbox.addEventListener('change', gerarSenha);
});
