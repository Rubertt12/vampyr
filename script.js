let salario15 = 0;
let salario30 = 0;
let extras = [];
let contas = {}; // Guarda as contas de cada mês individualmente
let mesAtual = new Date().getMonth();  // Pega o mês atual
let anoAtual = new Date().getFullYear(); // Pega o ano atual

window.onload = () => {
  carregarDados();
  renderizarCalendario();
  renderizarContasMes();
  atualizarResumo();
};

// Função para atualizar o mês e o ano
function renderizarCalendario() {
  const mesNome = new Date(anoAtual, mesAtual).toLocaleString('default', { month: 'long', year: 'numeric' });
  document.getElementById('mesAtual').textContent = mesNome;
}

// Função para alterar o mês
function mudarMes(quantidade) {
  mesAtual += quantidade;  // Modifica o mês baseado na quantidade

  if (mesAtual < 0) { 
    mesAtual = 11;   
    anoAtual--;      
  } else if (mesAtual > 11) { 
    mesAtual = 0;    
    anoAtual++;      
  }

  // Resetar os valores de salário e extras ao mudar o mês
  resetarValoresSalarioExtras();

  renderizarCalendario();
  renderizarContasMes();
  atualizarResumo();
}

function resetarValoresSalarioExtras() {
  salario15 = 0;
  salario30 = 0;
  extras = [];
  // Limpa os campos de entrada de salário e extras
  document.getElementById('salario15').value = '';
  document.getElementById('salario30').value = '';
  document.getElementById('extraNome').value = '';
  document.getElementById('extraValor').value = '';
}

function salvarSalarios() {
  salario15 = parseFloat(document.getElementById('salario15').value) || 0;
  salario30 = parseFloat(document.getElementById('salario30').value) || 0;
  salvarNoStorage();
  renderizarSalarios();  // Agora vai atualizar a lista de salários
  atualizarResumo();
}

function adicionarExtra() {
  const nome = document.getElementById('extraNome').value;
  const valor = parseFloat(document.getElementById('extraValor').value);
  if (!nome || isNaN(valor)) return;
  const novoExtra = { id: Date.now(), nome, valor }; // Usando ID único
  extras.push(novoExtra);
  document.getElementById('extraNome').value = '';
  document.getElementById('extraValor').value = '';
  salvarNoStorage();
  renderizarExtras();
  atualizarResumo();
}

function adicionarConta() {
  const nome = document.getElementById('contaNome').value;
  const valor = parseFloat(document.getElementById('contaValor').value);
  const data = document.getElementById('contaData').value;
  if (!nome || isNaN(valor) || !data) return;

  const mes = new Date(data).getMonth();  
  if (!contas[mes]) {
    contas[mes] = [];
  }

  const novaConta = { id: Date.now(), nome, valor, data };  // Usando ID único
  contas[mes].push(novaConta);

  document.getElementById('contaNome').value = '';
  document.getElementById('contaValor').value = '';
  document.getElementById('contaData').value = '';
  salvarNoStorage();
  renderizarContasMes();
  atualizarResumo();
}

// Renderiza a lista de salários
function renderizarSalarios() {
  const lista = document.getElementById('listaSalarios');
  lista.innerHTML = '';
  
  const salarioTotal = salario15 + salario30;
  const li = document.createElement('li');
  li.innerHTML = `Salário 15: R$ ${salario15.toFixed(2)} | Salário 30: R$ ${salario30.toFixed(2)} | Total: R$ ${salarioTotal.toFixed(2)}`;
  lista.appendChild(li);
}

// Modifica a função salvarSalarios para chamar renderizarSalarios
function salvarSalarios() {
  salario15 = parseFloat(document.getElementById('salario15').value) || 0;
  salario30 = parseFloat(document.getElementById('salario30').value) || 0;
  salvarNoStorage();
  renderizarSalarios();  // Agora vai atualizar a lista de salários
  atualizarResumo();
}

function carregarDados() {
  // Carrega os dados do mês atual
  const dadosMes = JSON.parse(localStorage.getItem('mes_' + mesAtual)) || {};
  salario15 = dadosMes.salario15 || 0;
  salario30 = dadosMes.salario30 || 0;
  extras = dadosMes.extras || [];
  contas = dadosMes.contas || {};

  document.getElementById('salario15').value = salario15;
  document.getElementById('salario30').value = salario30;
  
  renderizarExtras();
  renderizarContasMes();
  renderizarSalarios();  // Atualiza a lista de salários na carga dos dados
}

function renderizarExtras() {
  const lista = document.getElementById('listaExtras');
  lista.innerHTML = '';
  extras.forEach((e) => {
    const li = document.createElement('li');
    li.innerHTML = `${e.nome}: R$ ${e.valor.toFixed(2)} <button onclick="removerExtra(${e.id})">❌</button>`;
    lista.appendChild(li);
  });
}

function renderizarContasMes() {
  const lista = document.getElementById('listaContas');
  lista.innerHTML = '';
  const contasMes = contas[mesAtual] || [];

  contasMes.forEach((c) => {
    const li = document.createElement('li');
    li.innerHTML = `${c.nome} (venc. ${c.data}): R$ ${c.valor.toFixed(2)} <button onclick="removerConta(${c.id}, ${mesAtual})">❌</button>`;
    lista.appendChild(li);
  });
}

function atualizarResumo() {
  const totalExtras = extras.reduce((s, e) => s + e.valor, 0);
  const totalReceitas = salario15 + salario30 + totalExtras;
  const totalContas = (contas[mesAtual] || []).reduce((s, c) => s + c.valor, 0);
  const saldo = totalReceitas - totalContas;

  document.getElementById('totalRecebido').textContent = `R$ ${totalReceitas.toFixed(2)}`;
  document.getElementById('totalContas').textContent = `R$ ${totalContas.toFixed(2)}`;
  document.getElementById('saldoPrevisto').textContent = `R$ ${saldo.toFixed(2)}`;

  const statusLabel = document.getElementById('status');
  if (saldo > 0) {
    statusLabel.textContent = 'Positivo';
    statusLabel.style.color = 'green';
  } else if (saldo < 0) {
    statusLabel.textContent = 'Negativo';
    statusLabel.style.color = 'red';
  } else {
    statusLabel.textContent = 'Neutro';
    statusLabel.style.color = 'gray';
  }
}

function salvarNoStorage() {
  const dadosMes = {
    salario15,
    salario30,
    extras,
    contas
  };

  localStorage.setItem('mes_' + mesAtual, JSON.stringify(dadosMes));
}

function removerExtra(id) {
  extras = extras.filter(extra => extra.id !== id);
  salvarNoStorage();
  renderizarExtras();
  atualizarResumo();
}

function removerConta(id, mes) {
  contas[mes] = contas[mes].filter(conta => conta.id !== id);
  salvarNoStorage();
  renderizarContasMes();
  atualizarResumo();
}
function mudarMes(quantidade) {
  mesAtual += quantidade;  // Modifica o mês baseado na quantidade

  if (mesAtual < 0) { 
    mesAtual = 11;   
    anoAtual--;      
  } else if (mesAtual > 11) { 
    mesAtual = 0;    
    anoAtual++;      
  }

  renderizarCalendario();
  resetarValoresSalarioExtras();  // Zera os valores de salário e extras
  renderizarSalarios();  // Atualiza a lista de salários
  renderizarContasMes();
  atualizarResumo();
}

function salvarNoStorage() {
  const salario = { salario15, salario30, extras };  // Armazena dados por mês
  localStorage.setItem(`salario-${anoAtual}-${mesAtual}`, JSON.stringify(salario));  // Salva os dados de salário por mês
  localStorage.setItem('contas', JSON.stringify(contas));  // Mantém contas separadas para todos os meses
}

function carregarDados() {
  const salario = JSON.parse(localStorage.getItem(`salario-${anoAtual}-${mesAtual}`)) || { salario15: 0, salario30: 0, extras: [] };
  salario15 = salario.salario15;
  salario30 = salario.salario30;
  extras = salario.extras;

  document.getElementById('salario15').value = salario15;
  document.getElementById('salario30').value = salario30;

  renderizarExtras();
  renderizarContasMes();
  renderizarSalarios();  // Atualiza a lista de salários ao carregar os dados
}


function mudarMes(quantidade) {
  mesAtual += quantidade;  // Modifica o mês baseado na quantidade

  if (mesAtual < 0) { 
    mesAtual = 11;   
    anoAtual--;      
  } else if (mesAtual > 11) { 
    mesAtual = 0;    
    anoAtual++;      
  }

  renderizarCalendario();
  carregarDados();  // Carrega os dados do mês específico
  renderizarSalarios();  // Atualiza a lista de salários
  renderizarContasMes();
  atualizarResumo();
}
function resetarValoresSalarioExtras() {
  if (!localStorage.getItem(`salario-${anoAtual}-${mesAtual}`)) {
    salario15 = 0;
    salario30 = 0;
    extras = [];
    document.getElementById('salario15').value = '';
    document.getElementById('salario30').value = '';
    document.getElementById('extraNome').value = '';
    document.getElementById('extraValor').value = '';
  }
}
