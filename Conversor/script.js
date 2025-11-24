// Variáveis globais
let moedasData = {};
let moedasSelecionadas = [];
let todasMoedas = [];
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
function carregarDadosMoedas() {
    try {
        todasMoedas = dadosMoedasCompletos;
        
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
        <button class="button acao-btn historico" onclick="abrirModal('historico')">
            📊 Histórico
        </button>
        <button class="button acao-btn graficos" onclick="abrirModal('graficos')">
            📈 Gráficos
        </button>
        <button class="button acao-btn atualizar" onclick="buscarCotacoesTempoReal()">
            🔄 Atualizar
        </button>
    `;
}

// FUNÇÃO DE CÁLCULO
function calcularConversao() {
    const valor = parseFloat(valorInput.value);
    const moedaBase = moedaBaseSelect.value;
    
    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, digite um valor válido maior que zero!');
        return;
    }
    
    if (!moedaBase) {
        alert('Por favor, selecione uma moeda base!');
        return;
    }
    
    if (!moedasData[moedaBase]) {
        alert('Moeda base não encontrada!');
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
        alert('Por favor, digite um código de moeda!');
        return;
    }
    
    if (!moedasData[codigoMoeda]) {
        alert(`Moeda "${codigoMoeda}" não encontrada! Tente: ${Object.keys(moedasData).join(', ')}`);
        return;
    }
    
    if (moedasSelecionadas.includes(codigoMoeda)) {
        alert('Esta moeda já foi adicionada!');
        return;
    }
    
    moedasSelecionadas.push(codigoMoeda);
    taskInput.value = '';
    renderizarTarefas();
}

// Renderizar lista de moedas
function renderizarTarefas() {
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
                            onclick="toggleFavorito('${codigo}')">
                        ${isFavorito ? '⭐' : '☆'}
                    </button>
                    <div class="moeda-icon">${currencyIcons[codigo] || '💱'}</div>
                    <div>
                        <strong>${codigo}</strong> - ${moeda.nome}
                        <small>(${moeda.pais})</small>
                    </div>
                </div>
                <button class="button remove-btn" onclick="removerMoeda(${index})">Remover</button>
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
    if (!origem || !destino) return 0;
    const valorEmBRL = valor * origem.valor;
    return valorEmBRL / destino.valor;
}

function formatarMoeda(valor, codigoMoeda) {
    const moeda = moedasData[codigoMoeda];
    if (!moeda) return 'N/A';
    if (codigoMoeda === 'BTC' || valor < 0.01 || valor > 1000000) {
        return `${moeda.simbolo} ${valor.toFixed(6)}`;
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
    localStorage.setItem('historicoConversao', JSON.stringify(historicoConversao));
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
    
    localStorage.setItem('moedasFavoritas', JSON.stringify(moedasFavoritas));
    renderizarTarefas();
}

// Modo Escuro
function toggleModoEscuro() {
    modoEscuro = !modoEscuro;
    document.body.classList.toggle('modo-escuro', modoEscuro);
    modoEscuroToggle.textContent = modoEscuro ? '☀️' : '🌙';
    localStorage.setItem('modoEscuro', JSON.stringify(modoEscuro));
}

// API de Cotações (simulada)
async function buscarCotacoesTempoReal() {
    try {
        mostrarNotificacao('🔄 Atualizando cotações...');
        
        // Simular atualização de cotações
        Object.keys(moedasData).forEach(codigo => {
            if (codigo !== 'BRL') {
                // Variação aleatória de ±2%
                const variacao = (Math.random() - 0.5) * 0.04;
                moedasData[codigo].valor *= (1 + variacao);
            }
        });
        
        setTimeout(() => {
            mostrarNotificacao('✅ Cotações atualizadas!');
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
    
    // Dados de exemplo
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const datasets = moedasSelecionadas.slice(0, 4).map((codigo, index) => {
        const cores = ['#3498db', '#9b59b6', '#e74c3c', '#f1c40f'];
        const valorBase = moedasData[codigo].valor;
        
        return {
            label: codigo,
            data: Array(6).fill().map((_, i) => 
                valorBase * (0.95 + (Math.random() * 0.1))
            ),
            borderColor: cores[index],
            backgroundColor: cores[index] + '20',
            tension: 0.4,
            fill: true
        };
    });
    
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

function mostrarNotificacao(mensagem) {
    // Implementação simples de notificação
    alert(mensagem); // Você pode substituir por um sistema de notificação mais elaborado
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
    carregarDadosMoedas();
    
    // Aplicar modo escuro se estava ativo
    if (modoEscuro) {
        document.body.classList.add('modo-escuro');
        modoEscuroToggle.textContent = '☀️';
    }
    
    console.log('Aplicativo inicializado com sucesso!');
});
