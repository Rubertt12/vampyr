let salario01 = 0;
let salario05 = 0;
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
  resetarValoresSalarioExtras();  // Zera os valores de salário e extras, se necessário
  renderizarSalarios();  // Atualiza a lista de salários
  renderizarContasMes();
  atualizarResumo();
}


function resetarValoresSalarioExtras() {
  salario01 = 0;
  salario05 = 0;
  salario15 = 0;
  salario30 = 0;
  extras = [];
  // Limpa os campos de entrada de salário e extras
  document.getElementById('salario01').value = '';
  document.getElementById('salario05').value = '';
  document.getElementById('salario15').value = '';
  document.getElementById('salario30').value = '';
  document.getElementById('extraNome').value = '';
  document.getElementById('extraValor').value = '';
}

function salvarSalarios() {
  salario01 = parseFloat(document.getElementById('salario01').value) || 0;
  salario05 = parseFloat(document.getElementById('salario05').value) || 0;
  salario15 = parseFloat(document.getElementById('salario15').value) || 0;
  salario30 = parseFloat(document.getElementById('salario30').value) || 0;
  salvarNoStorage();
  renderizarSalarios();  // Atualiza a lista de salários
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
  
  const salarioTotal = salario01 + salario05 + salario15 + salario30;  // Agora inclui todos os salários
  const li = document.createElement('li');
  li.innerHTML = `Salário 01: R$ ${salario01.toFixed(2)} | Salário 05: R$ ${salario05.toFixed(2)} | Salário 15: R$ ${salario15.toFixed(2)} | Salário 30: R$ ${salario30.toFixed(2)} | Total: R$ ${salarioTotal.toFixed(2)}`;
  lista.appendChild(li);
}
function carregarDados() {
  // Carrega os dados do mês atual do localStorage
  
  contas = JSON.parse(localStorage.getItem('contas')) || {};
  const dadosMes = JSON.parse(localStorage.getItem('salario-' + anoAtual + '-' + mesAtual));

  // Verifica se os dados para o mês e ano selecionados existem. Se não, inicializa os valores.
  if (dadosMes) {
    salario01 = dadosMes.salario01 || 0;
    salario05 = dadosMes.salario05 || 0;
    salario15 = dadosMes.salario15 || 0;
    salario30 = dadosMes.salario30 || 0;
    extras = dadosMes.extras || [];
  } else {
    salario01 = 0;
    salario05 = 0;
    salario15 = 0;
    salario30 = 0;
    extras = [];
  }

  // Atualiza os campos com os valores carregados
  document.getElementById('salario01').value = salario01;
  document.getElementById('salario05').value = salario05;
  document.getElementById('salario15').value = salario15;
  document.getElementById('salario30').value = salario30;

  renderizarExtras();
  renderizarContasMes();
  renderizarSalarios();  // Atualiza a lista de salários ao carregar os dados
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
  const totalReceitas = salario01 + salario05 + salario15 + salario30 + totalExtras;
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
    salario01,
    salario05,
    salario15,
    salario30,
    extras
  };

  // Salva os dados de salários no localStorage para o mês e ano específicos
  localStorage.setItem('salario-' + anoAtual + '-' + mesAtual, JSON.stringify(dadosMes));
  console.log('Dados salvos para ' + anoAtual + '-' + mesAtual, dadosMes);
  
  // Salva as contas, que são globais para todos os meses
  localStorage.setItem('contas', JSON.stringify(contas));
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

function salvarNoBackend() {
  const salario = {salario01, salario05, salario15, salario30, extras };
  const dados = {
    ano: anoAtual,
    mes: mesAtual,
    salario
  };

  fetch('http://localhost/salvar_salarios.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })
  .then(response => response.json())
  .then(data => console.log('Salvo com sucesso!', data))
  .catch(error => console.error('Erro ao salvar:', error));
}
console.log(localStorage.getItem('salario-' + anoAtual + '-' + mesAtual));


let paginaAtual = 0;
const contasPorPagina = 3;

function renderizarContasMes() {
  const lista = document.getElementById('listaContas');
  lista.innerHTML = '';
  
  const contasMes = contas[mesAtual] || [];

  // Dividindo as contas em páginas de 3
  const totalPaginas = Math.ceil(contasMes.length / contasPorPagina);
  
  // Pega as contas da página atual
  const contasPaginaAtual = contasMes.slice(paginaAtual * contasPorPagina, (paginaAtual + 1) * contasPorPagina);
  
  // Exibe as contas da página atual
  contasPaginaAtual.forEach((c) => {
    const li = document.createElement('li');
    li.innerHTML = `${c.nome} (venc. ${c.data}): R$ ${c.valor.toFixed(2)} <button onclick="removerConta(${c.id}, ${mesAtual})">❌</button>`;
    lista.appendChild(li);
  });
  
  // Exibe os botões de navegação de página
  const navegação = document.getElementById('navegacaoPaginacao');
  navegação.innerHTML = ''; // Limpa os botões de navegação existentes
  
  if (paginaAtual > 0) {
    const anteriorButton = document.createElement('button');
    anteriorButton.textContent = 'Página Anterior';
    anteriorButton.onclick = () => mudarPagina(-1);
    navegação.appendChild(anteriorButton);
  }
  
  if (paginaAtual < totalPaginas - 1) {
    const proximaButton = document.createElement('button');
    proximaButton.textContent = 'Próxima Página';
    proximaButton.onclick = () => mudarPagina(1);
    navegação.appendChild(proximaButton);
  }
}

function mudarPagina(quantidade) {
  paginaAtual += quantidade;
  renderizarContasMes();
}

async function gerarPDFRelatorio() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nomeMes = new Date(anoAtual, mesAtual).toLocaleString('default', { month: 'long', year: 'numeric' });

  doc.setFontSize(18);
  doc.text(`Nota Fiscal - ${nomeMes}`, 10, 20);

  doc.setFontSize(12);
  doc.text('Salários:', 10, 30);
  doc.text(`• Salário 01: R$ ${salario01.toFixed(2)}`, 10, 38);
  doc.text(`• Salário 05: R$ ${salario05.toFixed(2)}`, 10, 46);
  doc.text(`• Salário 15: R$ ${salario15.toFixed(2)}`, 10, 54);
  doc.text(`• Salário 30: R$ ${salario30.toFixed(2)}`, 10, 62);
  const totalSalarios = salario01 + salario05 + salario15 + salario30;
  doc.text(`Total Salários: R$ ${totalSalarios.toFixed(2)}`, 10, 70);

  doc.text('Extras:', 10, 82);
  let y = 90;
  let totalExtras = 0;
  extras.forEach(extra => {
    doc.text(`• ${extra.nome}: R$ ${extra.valor.toFixed(2)}`, 10, y);
    y += 8;
    totalExtras += extra.valor;
  });

  if (extras.length === 0) {
    doc.text('• Nenhum extra registrado.', 10, y);
    y += 8;
  }

  doc.text(`Total Extras: R$ ${totalExtras.toFixed(2)}`, 10, y);
  y += 12;

  const contasMes = contas[mesAtual] || [];
  doc.text('Contas:', 10, y);
  y += 8;
  let totalContas = 0;
  contasMes.forEach(conta => {
    doc.text(`• ${conta.nome} (${conta.data}): R$ ${conta.valor.toFixed(2)}`, 10, y);
    y += 8;
    totalContas += conta.valor;
  });

  if (contasMes.length === 0) {
    doc.text('• Nenhuma conta registrada.', 10, y);
    y += 8;
  }

  y += 10;
  const saldo = totalSalarios + totalExtras - totalContas;
  doc.setFontSize(14);
  doc.text(`Resumo do mês:`, 10, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`• Total Recebido: R$ ${(totalSalarios + totalExtras).toFixed(2)}`, 10, y);
  y += 8;
  doc.text(`• Total Contas: R$ ${totalContas.toFixed(2)}`, 10, y);
  y += 8;
  doc.text(`• Saldo Final: R$ ${saldo.toFixed(2)}`, 10, y);

  doc.save(`Nota-Fiscal-${nomeMes.replace(' ', '-')}.pdf`);
}



