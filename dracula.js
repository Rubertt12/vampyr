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
    const duracaoVooLondres = parseInt(document.getElementById("duracaoVooLondres").value);
    const diasVooBudapesteTrans = document.getElementById("diasVooBudapesteTrans").value.split(",").map(d => d.trim());
    const horaVooBudTrans = document.getElementById("horaVooBudTrans").value;
    const diasTrem = document.getElementById("diasTrem").value.split(",").map(d => d.trim());
    const horaTrem = document.getElementById("horaTrem").value;
    const duracaoTrem = parseInt(document.getElementById("duracaoTrem").value);
    const nascerSol = document.getElementById("nascerSol").value;
    const porSol = document.getElementById("porSol").value;
    const velocidadeCaminhada = parseInt(document.getElementById("velocidadeCaminhada").value);
    const distanciaCastelo = parseInt(document.getElementById("distanciaCastelo").value);
  
    // Calcular a hora de chegada ao Castelo
    const vooHoraParts = vooLondresHora.split(":");
    const partidaVoo = new Date();
    partidaVoo.setHours(vooHoraParts[0], vooHoraParts[1], 0, 0); // Hora do voo Londres → Budapeste
    
    // Hora de chegada ao aeroporto de Budapeste
    const chegadaBudapeste = new Date(partidaVoo.getTime() + duracaoVooLondres * 60 * 60 * 1000); // Adicionar a duração do voo
  
    // Hora do trem para Novahuny
    const chegadaTrem = new Date(chegadaBudapeste.getTime() + duracaoTrem * 60 * 60 * 1000); // Adicionar a duração do trem
  
    // Calcular o tempo de caminhada
    const tempoCaminhada = distanciaCastelo / velocidadeCaminhada; // Tempo de caminhada em horas
    const chegadaCastelo = new Date(chegadaTrem.getTime() + tempoCaminhada * 60 * 60 * 1000); // Adicionar tempo de caminhada
  
    // Formatando a hora de chegada
    const horaChegada = `${chegadaCastelo.getHours().toString().padStart(2, '0')}:${chegadaCastelo.getMinutes().toString().padStart(2, '0')}`;
  
    // Exibindo todos os resultados
    const resultado = `
  🛫 Partida da Inglaterra: ${partidaDia.charAt(0).toUpperCase() + partidaDia.slice(1)}
  ✈️ Voo Londres → Budapeste às ${vooLondresHora} (duração: ${duracaoVooLondres}h)
  🛬 Voo Budapeste → Transilvânia em: ${diasVooBudapesteTrans.join(", ")} às ${horaVooBudTrans}
  🚂 Trem para Novahuny em: ${diasTrem.join(", ")} às ${horaTrem} (duração: ${duracaoTrem}h)
  🌅 Nascer do sol na Transilvânia: ${nascerSol}
  🌇 Pôr do sol na Transilvânia: ${porSol}
  🚶‍♂️ Caminhada até o Castelo a ${velocidadeCaminhada} km/h, distância: ${distanciaCastelo} km
  `;
  
    // Exibindo os resultados
    document.getElementById("resultado").textContent = resultado;
    
    // Exibindo a hora de chegada no lugar correto
    document.getElementById("horaChegada").textContent = `Hora de chegada ao castelo: ${horaChegada}`;
  }
  
  
