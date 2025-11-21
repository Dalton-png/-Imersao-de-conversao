// Variáveis globais
let moedasData = {};
let moedasSelecionadas = [];
let todasMoedas = [];

// Elementos DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const valorInput = document.getElementById('valorInput');
const moedaBaseSelect = document.getElementById('moedaBaseSelect');
const calcularBtn = document.getElementById('calcularBtn');
const resultadoCalculo = document.getElementById('resultadoCalculo');

// Dados completos das moedas (baseado no seu JSON)
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
        moedasSelecionadas = ['BRL', 'USD', 'EUR'];
        renderizarTarefas();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Popular select com moedas
function popularSelectMoedas() {
    moedaBaseSelect.innerHTML = '';
    Object.keys(moedasData).forEach(codigo => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = `${codigo} - ${moedasData[codigo].nome}`;
        moedaBaseSelect.appendChild(option);
    });
}

// FUNÇÃO DE CÁLCULO
function calcularConversao() {
    const valor = parseFloat(valorInput.value);
    const moedaBase = moedaBaseSelect.value;
    
    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, digite um valor válido maior que zero!');
        return;
    }
    
    if (!moedasData[moedaBase]) {
        alert('Moeda base não encontrada!');
        return;
    }
    
    let resultadoHTML = `
        <h4>💱 ${valor} ${moedasData[moedaBase].simbolo} equivale a:</h4>
        <div class="conversoes-lista">
    `;
    
    Object.keys(moedasData).forEach(codigo => {
        if (codigo !== moedaBase) {
            const valorConvertido = converterMoeda(valor, moedaBase, codigo);
            const moeda = moedasData[codigo];
            
            resultadoHTML += `
                <div class="conversao-resultado">
                    <span>${moeda.nome} (${codigo}):</span>
                    <span class="valor">${formatarMoeda(valorConvertido, codigo)}</span>
                </div>
            `;
        }
    });
    
    resultadoHTML += `</div>`;
    resultadoCalculo.innerHTML = resultadoHTML;
    resultadoCalculo.classList.add('mostrar');
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
    
    moedasSelecionadas.forEach((codigo, index) => {
        const moeda = moedasData[codigo];
        const moedaCompleta = todasMoedas.find(m => m.codigo === codigo);
        
        const moedaItem = document.createElement('div');
        moedaItem.className = 'moeda-card';
        moedaItem.innerHTML = `
            <div class="moeda-header">
                <div class="moeda-titulo">
                    ${codigo} - ${moeda.nome}
                    <small>(${moeda.pais})</small>
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
                    <div>1 ${moedaBaseData.simbolo}</div>
                    <div>=</div>
                    <div><strong>${valorConvertido.toFixed(4)} ${moedaDestinoData.simbolo}</strong></div>
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

// Event Listeners
addTaskBtn.addEventListener('click', adicionarTarefa);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') adicionarTarefa();
});

calcularBtn.addEventListener('click', calcularConversao);
valorInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcularConversao();
});

// Inicializar
document.addEventListener('DOMContentLoaded', carregarDadosMoedas);