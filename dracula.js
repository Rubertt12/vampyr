let paginaAtual = 0;

function mudarPagina(direcao) {
    const paginas = document.querySelectorAll(".page");
    const botaoIniciar = document.getElementById("btnIniciarMissao");
    const botaoVoltarFinal = document.getElementById("btnVoltarFinal");
  
    paginas[paginaAtual].classList.remove("active");
    paginaAtual += direcao;
  
    if (paginaAtual < 0) paginaAtual = 0;
    if (paginaAtual >= paginas.length) paginaAtual = paginas.length - 1;
  
    paginas[paginaAtual].classList.add("active");
  
    // Mostrar botões apenas na última página
    const ultima = paginaAtual === paginas.length - 1;
    botaoIniciar.style.display = ultima ? "inline-block" : "none";
    botaoVoltarFinal.style.display = ultima ? "inline-block" : "none";
  }
  


function iniciarMissao() {
    document.getElementById("intro").style.display = 'none';
    document.getElementById("controls").style.display = 'block';
    
  }
  



  function voltarParaIntro() {
    document.getElementById("controls").style.display = 'none';
    document.getElementById("intro").style.display = 'block';
    paginaAtual = 0;
  
    const paginas = document.querySelectorAll(".page");
    paginas.forEach(p => p.classList.remove("active"));
    paginas[0].classList.add("active");
  
    // Esconde botões da última página
    document.getElementById("btnIniciarMissao").style.display = "none";
    document.getElementById("btnVoltarFinal").style.display = "none";
  }
  

  const botaoVoltarFinal = document.getElementById("btnVoltarFinal");
if (botaoVoltarFinal) {
  botaoVoltarFinal.style.display = paginaAtual === paginas.length - 1 ? "inline-block" : "none";
}




function gerarMissao() {
  const partidaDia = document.getElementById("partidaDia").value;
  const vooLondresHora = document.getElementById("vooLondresHora").value;
  const duracaoVooLondres = document.getElementById("duracaoVooLondres").value;
  const diasVooBudapesteTrans = document.getElementById("diasVooBudapesteTrans").value.split(",").map(d => d.trim());
  const horaVooBudTrans = document.getElementById("horaVooBudTrans").value;
  const diasTrem = document.getElementById("diasTrem").value.split(",").map(d => d.trim());
  const horaTrem = document.getElementById("horaTrem").value;
  const duracaoTrem = document.getElementById("duracaoTrem").value;
  const nascerSol = document.getElementById("nascerSol").value;
  const porSol = document.getElementById("porSol").value;
  const velocidadeCaminhada = document.getElementById("velocidadeCaminhada").value;
  const distanciaCastelo = document.getElementById("distanciaCastelo").value;

  const resultado = `
🛫 Partida da Inglaterra: ${partidaDia.charAt(0).toUpperCase() + partidaDia.slice(1)}
✈️ Voo Londres → Budapeste às ${vooLondresHora} (duração: ${duracaoVooLondres}h)
🛬 Voo Budapeste → Transilvânia em: ${diasVooBudapesteTrans.join(", ")} às ${horaVooBudTrans}
🚂 Trem para Novahuny em: ${diasTrem.join(", ")} às ${horaTrem} (duração: ${duracaoTrem}h)
🌅 Nascer do sol na Transilvânia: ${nascerSol}
🌇 Pôr do sol na Transilvânia: ${porSol}
🚶‍♂️ Caminhada até o Castelo a ${velocidadeCaminhada} km/h, distância: ${distanciaCastelo} km
`;

  document.getElementById("resultado").textContent = resultado;
}
