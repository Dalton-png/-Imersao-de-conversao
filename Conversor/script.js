// Variáveis globais
let moedasData = {};
let moedasSelecionadas = [];
let todasMoedas = [];
let prevRenderKey = '';
let historicoConversao = JSON.parse(localStorage.getItem('historicoConversao')) || [];
let moedasFavoritas = JSON.parse(localStorage.getItem('moedasFavoritas')) || [];
let modoEscuro = JSON.parse(localStorage.getItem('modoEscuro')) || false;

// Elementos DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const valorInput = document.getElementById('valorInput');
const moedaBaseSelect = document.getElementById('moedaBaseSelect');
const calcularBtn = document.getElementById('calcularBtn');
const resultadoCalculo = document.getElementById('resultadoCalculo');
const modoEscuroToggle = document.getElementById('modoEscuroToggle');
const modalHistorico = document.getElementById('modalHistorico');
const modalGraficos = document.getElementById('modalGraficos');
const historicoLista = document.getElementById('historicoLista');
const limparHistoricoBtn = document.getElementById('limparHistorico');
const graficoEvolucao = document.getElementById('graficoEvolucao');
const acoesContainer = document.getElementById('acoesContainer');

// Mapeamento de BANDEIRAS para cada moeda
const currencyIcons = {
    'USD': '🇺🇸',
    'EUR': '🇪🇺',
    'GBP': '🇬🇧',
    'JPY': '🇯🇵',
    'ARS': '🇦🇷',
    'CAD': '🇨🇦',
    'AUD': '🇦🇺',
    'CNY': '🇨🇳',
    'BRL': '🇧🇷',
    'INR': '🇮🇳',
    'RUB': '🇷🇺',
    'MXN': '🇲🇽',
    'BTC': '🌐' // Bitcoin não tem país, usei um globo
};
;

// Dados das moedas (seus dados corrigidos)
const dadosMoedasCompletos = [
    {
        "codigo": "CNY",
        "nome": "Yuan Chinês (Renminbi)",
        "descricao": "Moeda oficial da República Popular da China, uma das mais influentes no comércio global.",
        "data_criacao": "1948",
        "valor": 0.75,
        "simbolo": "¥",
        "pais": "China",
        "tags": ["Ásia", "Câmbio Controlado", "Comércio Internacional", "Economia Emergente"]
    },
    {
        "codigo": "AUD", 
        "nome": "Dólar Australiano",
        "descricao": "Moeda da Commonwealth da Austrália, incluindo a Ilha Christmas, Ilhas Cocos (Keeling) e Ilha Norfolk.",
        "data_criacao": "1966",
        "valor": 3.60,
        "simbolo": "A$",
        "pais": "Austrália",
        "tags": ["Oceania", "Commodities", "Reserva Estrangeira", "Câmbio Flutuante"]
    },
    {
        "codigo": "CAD",
        "nome": "Dólar Canadense", 
        "descricao": "Moeda oficial do Canadá, amplamente negociada devido à proximidade e relações comerciais com os EUA.",
        "data_criacao": "1871",
        "valor": 4.05,
        "simbolo": "C$", 
        "pais": "Canadá",
        "tags": ["América do Norte", "Reservas Globais", "Mercado de Energia", "Câmbio Flutuante"]
    },
    {
        "codigo": "BRL",
        "nome": "Real Brasileiro",
        "descricao": "A moeda corrente do Brasil, introduzida para estabilizar a economia e combater a hiperinflação.",
        "data_criacao": "1994", 
        "valor": 1,
        "simbolo": "R$",
        "pais": "Brasil",
        "tags": ["América do Sul", "Economia Emergente", "Inflação", "Banco Central"]
    },
    {
        "codigo": "INR",
        "nome": "Rupia Indiana",
        "descricao": "Moeda oficial da Índia, uma das maiores economias emergentes do mundo.",
        "data_criacao": "1957",
        "valor": 0.054,
        "simbolo": "₹",
        "pais": "Índia",
        "tags": ["Subcontinente Indiano", "População", "Comércio Regional", "Controle de Capital"]
    },
    {
        "codigo": "RUB",
        "nome": "Rublo Russo",
        "descricao": "Moeda da Federação Russa, sujeita a grandes flutuações devido à geopolítica e preços de energia.",
        "data_criacao": "1998",
        "valor": 0.055,
        "simbolo": "₽",
        "pais": "Rússia",
        "tags": ["Leste Europeu", "Commodities", "Geopolítica", "Sanções"]
    },
    {
        "codigo": "MXN",
        "nome": "Peso Mexicano",
        "descricao": "Moeda oficial do México, uma das moedas mais negociadas da América Latina.",
        "data_criacao": "1993",
        "valor": 0.29,
        "simbolo": "$",
        "pais": "México",
        "tags": ["América Latina", "Remessas", "Reservas Globais", "Câmbio Flutuante"]
    },
    {
        "codigo": "JPY",
        "nome": "Iene Japonês",
        "descricao": "Moeda do Japão, terceira mais negociada no mercado de câmbio após o dólar americano e euro.",
        "data_criacao": "1871",
        "valor": 0.037,
        "simbolo": "¥",
        "pais": "Japão",
        "tags": ["Ásia", "Tecnologia", "Exportação", "Deflação"]
    },
    {
        "codigo": "GBP",
        "nome": "Libra Esterlina",
        "descricao": "Moeda do Reino Unido, a mais antiga ainda em uso e quarta mais negociada no mundo.",
        "data_criacao": "1694",
        "valor": 7.20,
        "simbolo": "£",
        "pais": "Reino Unido",
        "tags": ["Europa", "Histórica", "Reserva", "Brexit"]
    },
    {
        "codigo": "USD",
        "nome": "Dólar Americano",
        "descricao": "Principal moeda de reserva internacional, utilizada como padrão em transações globais.",
        "data_criacao": "1792",
        "valor": 5.50,
        "simbolo": "US$",
        "pais": "Estados Unidos",
        "tags": ["Global", "Reserva", "Petróleo", "Hegemonia"]
    },
    {
        "codigo": "EUR",
        "nome": "Euro",
        "descricao": "Moeda oficial da Zona do Euro, segunda maior moeda de reserva internacional.",
        "data_criacao": "1999",
        "valor": 6.00,
        "simbolo": "€",
        "pais": "União Europeia",
        "tags": ["Europa", "Integração", "Reserva", "Estabilidade"]
    },
    {
        "codigo": "ARS",
        "nome": "Peso Argentino",
        "descricao": "Moeda da Argentina, historicamente marcada por crises econômicas e desvalorizações.",
        "data_criacao": "1992",
        "valor": 0.006,
        "simbolo": "ARS$",
        "pais": "Argentina",
        "tags": ["América do Sul", "Hiperinflação", "Controle de Capital", "Crise Fiscal"]
    },
    {
        "codigo": "BTC",
        "nome": "Bitcoin",
        "descricao": "Primeira criptomoeda descentralizada, operando sem uma autoridade central ou bancos.",
        "data_criacao": "2009",
        "valor": 350000,
        "simbolo": "₿",
        "pais": "Global",
        "tags": ["Criptomoeda", "Blockchain", "Descentralizado", "Volátil"]
    }
];

// Carregar dados das moedas
function carregarDadosMoedas(externalData) {
    try {
        todasMoedas = (externalData && Array.isArray(externalData)) ? externalData : dadosMoedasCompletos;

        // Converter para o formato que o conversor precisa
        todasMoedas.forEach(moeda => {
            moedasData[moeda.codigo] = {
                nome: moeda.nome,
                valor: moeda.valor,
                simbolo: moeda.simbolo,
                pais: moeda.pais,
                descricao: moeda.descricao,
                data_criacao: moeda.data_criacao,
                tags: moeda.tags
            };
        });

        console.log('Dados das moedas carregados:', moedasData);
        popularSelectMoedas();

        // Inicializar com moedas padrão
        moedasSelecionadas = ['USD', 'EUR', 'BRL'];
        renderizarTarefas();
        criarBotoesAcoes();

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Popular select com moedas
function popularSelectMoedas() {
    moedaBaseSelect.innerHTML = '<option value="">Selecione a moeda base</option>';
    Object.keys(moedasData).forEach(codigo => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = `${currencyIcons[codigo] || '💱'} ${codigo} - ${moedasData[codigo].nome}`;
        moedaBaseSelect.appendChild(option);
    });
}

// Criar botões de ações
function criarBotoesAcoes() {
    acoesContainer.innerHTML = `
        <button class="button acao-btn historico" onclick="abrirModal('historico')" aria-label="Abrir histórico" tabindex="0">
            📊 Histórico
        </button>
        <button class="button acao-btn graficos" onclick="abrirModal('graficos')" aria-label="Abrir gráficos" tabindex="0">
            📈 Gráficos
        </button>
        <button class="button acao-btn atualizar" onclick="buscarCotacoesTempoReal()" aria-label="Atualizar cotações" tabindex="0">
            🔄 Atualizar
        </button>
    `;
}

// FUNÇÃO DE CÁLCULO
function calcularConversao() {
    const raw = (valorInput.value || '').toString().trim();
    const numberRegex = /^\d+(?:[\.,]\d+)?$/;
    if (!numberRegex.test(raw)) {
        mostrarNotificacao('Por favor, digite um valor numérico válido.', 'error');
        valorInput.classList.add('input-error');
        valorInput.focus();
        return;
    }

    const valor = parseFloat(raw.replace(',', '.'));
    const moedaBase = moedaBaseSelect.value;

    if (isNaN(valor) || valor <= 0) {
        mostrarNotificacao('Por favor, digite um valor válido maior que zero!', 'error');
        valorInput.classList.add('input-error');
        valorInput.focus();
        return;
    }
    valorInput.classList.remove('input-error');

    if (!moedaBase) {
        mostrarNotificacao('Por favor, selecione uma moeda base!', 'error');
        moedaBaseSelect.focus();
        return;
    }

    if (!moedasData[moedaBase]) {
        mostrarNotificacao('Moeda base não encontrada!', 'error');
        return;
    }

    let resultadoHTML = `
        <h4>${currencyIcons[moedaBase] || '💱'} ${valor} ${moedasData[moedaBase].simbolo} equivale a:</h4>
        <div class="conversoes-lista">
    `;

    const resultados = {};

    Object.keys(moedasData).forEach(codigo => {
        if (codigo !== moedaBase) {
            const valorConvertido = converterMoeda(valor, moedaBase, codigo);
            const moeda = moedasData[codigo];

            resultados[codigo] = formatarMoeda(valorConvertido, codigo);

            resultadoHTML += `
                <div class="conversao-resultado">
                    <span>${currencyIcons[codigo] || '💱'} ${moeda.nome} (${codigo}):</span>
                    <span class="valor">${resultados[codigo]}</span>
                </div>
            `;
        }
    });

    resultadoHTML += `</div>`;
    resultadoCalculo.innerHTML = resultadoHTML;
    resultadoCalculo.classList.add('mostrar');

    // Adicionar ao histórico
    adicionarAoHistorico(valor, moedaBase, resultados);
    animarAtualizacaoValor(resultadoCalculo);
}

// Adicionar moeda à lista
function adicionarTarefa() {
    const codigoMoeda = taskInput.value.trim().toUpperCase();
    
    if (!codigoMoeda) {
        mostrarNotificacao('Por favor, digite um código de moeda!', 'error');
        taskInput.classList.add('input-error');
        taskInput.focus();
        return;
    }

    // Validate ISO-like 3-letter code
    if (!/^[A-Z]{3}$/.test(codigoMoeda)) {
        mostrarNotificacao('Código de moeda inválido. Use 3 letras (ex: USD).', 'error');
        taskInput.classList.add('input-error');
        taskInput.focus();
        return;
    }

    if (!moedasData[codigoMoeda]) {
        mostrarNotificacao(`Moeda "${codigoMoeda}" não encontrada! Tente: ${Object.keys(moedasData).join(', ')}`, 'error');
        taskInput.classList.add('input-error');
        return;
    }

    if (moedasSelecionadas.includes(codigoMoeda)) {
        mostrarNotificacao('Esta moeda já foi adicionada!', 'info');
        return;
    }
    
    moedasSelecionadas.push(codigoMoeda);
    taskInput.value = '';
    renderizarTarefas();
}

// Renderizar lista de moedas
function renderizarTarefas() {
    // Performance: avoid full re-render if nothing meaningful changed
    const key = JSON.stringify(moedasSelecionadas) + '|' + JSON.stringify(moedasFavoritas);
    if (key === prevRenderKey) return;
    prevRenderKey = key;

    taskList.innerHTML = '';
    
    if (moedasSelecionadas.length === 0) {
        taskList.innerHTML = '<div class="sem-conversao">Nenhuma moeda adicionada. Use o campo acima para adicionar moedas.</div>';
        return;
    }
    
    moedasSelecionadas.forEach((codigo, index) => {
        const moeda = moedasData[codigo];
        const moedaCompleta = todasMoedas.find(m => m.codigo === codigo);
        const isFavorito = moedasFavoritas.includes(codigo);
        
        const moedaItem = document.createElement('div');
        moedaItem.className = 'moeda-card';
        moedaItem.setAttribute('data-currency', codigo);
        
            moedaItem.innerHTML = `
            <div class="moeda-header">
                <div class="moeda-titulo">
                    <button class="favorito-btn ${isFavorito ? 'ativo' : ''}" 
                            onclick="toggleFavorito('${codigo}')" aria-label="Favoritar ${codigo}" role="button">
                        ${isFavorito ? '⭐' : '☆'}
                    </button>
                    <div class="moeda-icon">${currencyIcons[codigo] || '💱'}</div>
                    <div>
                        <strong>${codigo}</strong> - ${moeda.nome}
                        <small>(${moeda.pais})</small>
                    </div>
                </div>
                <button class="button remove-btn" onclick="removerMoeda(${index})" aria-label="Remover ${codigo}">Remover</button>
            </div>
            ${moedaCompleta ? `
                <div class="moeda-info">
                    <p class="moeda-descricao">${moedaCompleta.descricao}</p>
                    <div class="moeda-tags">
                        ${moedaCompleta.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <small>Criada em: ${moedaCompleta.data_criacao}</small>
                </div>
            ` : ''}
            <div class="conversoes-grid">
                ${gerarConversoes(codigo)}
            </div>
        `;
        
        taskList.appendChild(moedaItem);
    });
}

// Funções auxiliares
function converterMoeda(valor, moedaOrigem, moedaDestino) {
    const origem = moedasData[moedaOrigem];
    const destino = moedasData[moedaDestino];
    if (!origem || !destino) return NaN;
    const origemValor = Number(origem.valor);
    const destinoValor = Number(destino.valor);
    if (!Number.isFinite(origemValor) || !Number.isFinite(destinoValor)) return NaN;
    if (origemValor === 0 || destinoValor === 0) return NaN;
    const valorEmBRL = valor * origemValor;
    return valorEmBRL / destinoValor;
}

function formatarMoeda(valor, codigoMoeda) {
    const moeda = moedasData[codigoMoeda];
    if (!moeda) return 'N/A';
    if (!Number.isFinite(valor) || isNaN(valor)) return 'Valor indisponível';
    const abs = Math.abs(valor);
    if (codigoMoeda === 'BTC' || abs < 0.01) {
        return `${moeda.simbolo} ${valor.toFixed(6)}`;
    }
    if (abs > 1e12) {
        return `${moeda.simbolo} ${valor.toExponential(6)}`;
    }
    return `${moeda.simbolo} ${valor.toFixed(2)}`;
}

function gerarConversoes(moedaBase) {
    let conversoesHTML = '';
    const moedaBaseData = moedasData[moedaBase];
    
    moedasSelecionadas.forEach(codigoDestino => {
        if (codigoDestino !== moedaBase) {
            const valorConvertido = converterMoeda(1, moedaBase, codigoDestino);
            const moedaDestinoData = moedasData[codigoDestino];
            
            conversoesHTML += `
                <div class="conversao-item">
                    <div>${currencyIcons[moedaBase] || '💱'} 1 ${moedaBaseData.simbolo}</div>
                    <div>=</div>
                    <div><strong>${currencyIcons[codigoDestino] || '💱'} ${valorConvertido.toFixed(4)} ${moedaDestinoData.simbolo}</strong></div>
                </div>
            `;
        }
    });
    
    return conversoesHTML || '<div class="sem-conversao">Adicione mais moedas para ver conversões</div>';
}

function removerMoeda(index) {
    moedasSelecionadas.splice(index, 1);
    renderizarTarefas();
}

// Sistema de Histórico
function adicionarAoHistorico(valor, moedaOrigem, resultados) {
    const historicoItem = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        valor: valor,
        moedaOrigem: moedaOrigem,
        resultados: resultados
    };
    
    historicoConversao.unshift(historicoItem);
    
    // Manter apenas os últimos 20 itens
    if (historicoConversao.length > 20) {
        historicoConversao = historicoConversao.slice(0, 20);
    }
    
    salvarHistorico();
}

function salvarHistorico() {
    try {
        localStorage.setItem('historicoConversao', JSON.stringify(historicoConversao));
    } catch (e) {
        console.error('Storage error:', e);
    }
}

function atualizarHistoricoUI() {
    historicoLista.innerHTML = '';
    
    if (historicoConversao.length === 0) {
        historicoLista.innerHTML = '<p class="sem-conversao">Nenhuma conversão no histórico</p>';
        return;
    }
    
    historicoConversao.forEach(item => {
        const historicoItem = document.createElement('div');
        historicoItem.className = 'historico-item';
        
        // Pegar os primeiros 3 resultados para mostrar
        const primeirosResultados = Object.entries(item.resultados).slice(0, 3);
        
        historicoItem.innerHTML = `
            <div class="historico-data">${item.data}</div>
            <div class="historico-conversao">
                <strong>${item.valor} ${moedasData[item.moedaOrigem]?.simbolo || item.moedaOrigem}</strong>
                <span>→</span>
                <div>
                    ${primeirosResultados.map(([moeda, valor]) => 
                        `<small>${valor}</small>`
                    ).join(' • ')}
                </div>
            </div>
        `;
        historicoLista.appendChild(historicoItem);
    });
}

// Sistema de Favoritos
function toggleFavorito(codigoMoeda) {
    const index = moedasFavoritas.indexOf(codigoMoeda);
    
    if (index === -1) {
        moedasFavoritas.push(codigoMoeda);
        mostrarNotificacao(`⭐ ${codigoMoeda} adicionado aos favoritos`);
    } else {
        moedasFavoritas.splice(index, 1);
        mostrarNotificacao(`❌ ${codigoMoeda} removido dos favoritos`);
    }
    try {
        localStorage.setItem('moedasFavoritas', JSON.stringify(moedasFavoritas));
    } catch (e) {
        console.error('Storage error:', e);
    }
    renderizarTarefas();
}

// Modo Escuro
function toggleModoEscuro() {
    modoEscuro = !modoEscuro;
    document.body.classList.toggle('modo-escuro', modoEscuro);
    modoEscuroToggle.textContent = modoEscuro ? '☀️' : '🌙';
    try {
        localStorage.setItem('modoEscuro', JSON.stringify(modoEscuro));
    } catch (e) {
        console.error('Storage error:', e);
    }
}

// API de Cotações (simulada)
async function buscarCotacoesTempoReal() {
    mostrarNotificacao('🔄 Atualizando cotações...', 'info');

    // Primeiro, tentar buscar cotações reais da API
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
        if (response.ok) {
            const data = await response.json();
            const rates = data.rates || {};

            Object.keys(moedasData).forEach(codigo => {
                if (codigo === 'BRL') {
                    moedasData[codigo].valor = 1;
                } else if (rates[codigo] && rates[codigo] > 0) {
                    // API retorna quanto 1 BRL vale na outra moeda (ex: rates.USD = 0.19 => 1 BRL = 0.19 USD)
                    // Nosso formato espera quanto 1 [moeda] vale em BRL, então invertendo:
                    moedasData[codigo].valor = 1 / rates[codigo];
                }
            });

            mostrarNotificacao('✅ Cotações atualizadas (API)!', 'success');
            salvarSnapshotCotacoes();
            renderizarTarefas();
            return;
        } else {
            console.warn('API retornou erro, usando simulação. Status:', response.status);
        }
    } catch (err) {
        console.warn('Erro ao buscar da API, usando simulação.', err);
    }

    // Fallback: simular pequenas variações quando a API não estiver disponível
    try {
        Object.keys(moedasData).forEach(codigo => {
            if (codigo !== 'BRL') {
                const variacao = (Math.random() - 0.5) * 0.04;
                moedasData[codigo].valor *= (1 + variacao);
            }
        });

        setTimeout(() => {
            mostrarNotificacao('✅ Cotações atualizadas (simulação)!', 'success');
            salvarSnapshotCotacoes();
            renderizarTarefas();
        }, 1000);
    } catch (error) {
        console.error('Erro ao buscar cotações:', error);
        mostrarNotificacao('❌ Erro ao atualizar cotações');
    }
}

// Gráficos
function inicializarGraficos() {
    const ctx = graficoEvolucao.getContext('2d');

    // Prefer historical snapshots (saved snapshots of rates) when available
    const snapshots = JSON.parse(localStorage.getItem('cotacoesSnapshots') || '[]');
    let labels = [];
    let datasets = [];

    if (snapshots && snapshots.length > 0) {
        // Use up to last 30 snapshots
        const recent = snapshots.slice(-30);
        labels = recent.map(s => s.date);

        const cores = ['#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#27ae60', '#f39c12'];

        datasets = moedasSelecionadas.slice(0, 6).map((codigo, index) => {
            const data = recent.map(s => {
                const v = s.rates && s.rates[codigo];
                return (typeof v === 'number') ? v : null;
            });

            return {
                label: codigo,
                data: data,
                borderColor: cores[index % cores.length],
                backgroundColor: cores[index % cores.length] + '20',
                tension: 0.4,
                fill: true
            };
        });
    } else {
        // Fallback: sample data similar to before (but limited)
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const cores = ['#3498db', '#9b59b6', '#e74c3c', '#f1c40f'];
        datasets = moedasSelecionadas.slice(0, 4).map((codigo, index) => {
            const valorBase = moedasData[codigo] ? moedasData[codigo].valor : 1;
            return {
                label: codigo,
                data: Array(6).fill().map((_, i) => valorBase * (0.95 + (Math.random() * 0.1))),
                borderColor: cores[index],
                backgroundColor: cores[index] + '20',
                tension: 0.4,
                fill: true
            };
        });
    }
    
    // Destruir gráfico anterior se existir
    if (window.meuGrafico) {
        window.meuGrafico.destroy();
    }
    
    window.meuGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução das Cotações (Últimos 6 Meses)'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Toast helper
function showToast(message, type = 'success', timeout = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return alert(message);

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => container.removeChild(toast), 300);
    }, timeout);
}

// Replace default notification with toast
function mostrarNotificacao(mensagem, tipo = 'info') {
    showToast(mensagem, tipo === 'error' ? 'error' : (tipo === 'success' ? 'success' : 'info'));
}

// Save a daily snapshot of current rates (keeps last 30)
function salvarSnapshotCotacoes() {
    try {
        const snapshots = JSON.parse(localStorage.getItem('cotacoesSnapshots') || '[]');
        const today = new Date().toISOString().slice(0, 10);

        if (snapshots.length && snapshots[snapshots.length - 1].date === today) return;

        const snapshot = {
            date: today,
            rates: {}
        };

        Object.keys(moedasData).forEach(c => {
            snapshot.rates[c] = Number(moedasData[c].valor) || null;
        });

        snapshots.push(snapshot);
        // keep up to 90 days
        const max = 90;
        const trimmed = snapshots.slice(-max);
        try { localStorage.setItem('cotacoesSnapshots', JSON.stringify(trimmed)); } catch (e) { console.error('Storage error:', e); }
    } catch (e) {
        console.error('Erro ao salvar snapshot:', e);
    }
}

// Modal Functions
function abrirModal(tipo) {
    if (tipo === 'historico') {
        atualizarHistoricoUI();
        modalHistorico.style.display = 'block';
    } else if (tipo === 'graficos') {
        inicializarGraficos();
        modalGraficos.style.display = 'block';
    }
}

function fecharModal(modal) {
    modal.style.display = 'none';
}

// Funções auxiliares
function animarAtualizacaoValor(elemento) {
    elemento.classList.add('value-changing');
    setTimeout(() => {
        elemento.classList.remove('value-changing');
    }, 600);
}


// Event Listeners
addTaskBtn.addEventListener('click', adicionarTarefa);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') adicionarTarefa();
});

calcularBtn.addEventListener('click', calcularConversao);
valorInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcularConversao();
});

modoEscuroToggle.addEventListener('click', toggleModoEscuro);

limparHistoricoBtn.addEventListener('click', () => {
    historicoConversao = [];
    salvarHistorico();
    atualizarHistoricoUI();
    mostrarNotificacao('🗑️ Histórico limpo');
});

// Event Listeners para modais
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        fecharModal(this.closest('.modal'));
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        fecharModal(event.target);
    }
});

// Inicializar app quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Tentar carregar dados externos de `moedas.json`, se falhar usa os dados locais
    fetch('moedas.json')
        .then(response => response.json())
        .then(data => {
            carregarDadosMoedas(data);
        })
        .catch(err => {
            console.warn('Não foi possível carregar moedas.json, usando dados locais.', err);
            carregarDadosMoedas();
        });

    // Aplicar modo escuro se estava ativo
    if (modoEscuro) {
        document.body.classList.add('modo-escuro');
        modoEscuroToggle.textContent = '☀️';
    }

    console.log('Aplicativo inicializado com sucesso!');
});
