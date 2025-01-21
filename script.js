const board = document.getElementById("game-board");
const results = document.getElementById("results");
const restartBtn = document.getElementById("restart-btn");

let players = [];
let path = [];
let alivePlayers = [];

// Inicializar juego
function startGame() {
  results.innerHTML = "";
  restartBtn.style.display = "none";

  // Generar jugadores (1 humano + 9 bots)
  players = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    type: i === 0 ? "Jugador" : "Bot",
    position: -1,
    alive: true,
  }));
  
  // Asignar orden aleatorio
  players.sort(() => Math.random() - 0.5);

  // Generar el camino de cristales (10 pasos)
  path = Array.from({ length: 10 }, () => Math.random() > 0.5 ? "safe" : "broken");
  alivePlayers = [...players];

  renderGame();
}

// Renderizar el tablero y los jugadores
function renderGame() {
  board.innerHTML = "";
  
  // Mostrar camino
  path.forEach((state, index) => {
    const crystal = document.createElement("div");
    crystal.className = "crystal";
    crystal.dataset.index = index;
    board.appendChild(crystal);
  });

  // Mostrar jugadores
  alivePlayers.forEach(player => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";
    playerDiv.textContent = `${player.type} ${player.id}`;
    board.appendChild(playerDiv);
  });

  // Iniciar la ronda
  playRound();
}

// Simular una ronda
function playRound() {
  alivePlayers.forEach(player => {
    if (!player.alive) return;

    // Avanzar al siguiente cristal
    player.position++;

    // Verificar si cae en un cristal roto
    if (path[player.position] === "broken") {
      player.alive = false;
    }
  });

  // Actualizar lista de jugadores vivos
  alivePlayers = alivePlayers.filter(player => player.alive);

  // Verificar fin de la ronda
  setTimeout(() => {
    if (alivePlayers.length > 1 && alivePlayers.some(p => p.position === 9)) {
      // Nueva ronda si más de un jugador llegó al final
      path = Array.from({ length: 10 }, () => Math.random() > 0.5 ? "safe" : "broken");
      renderGame();
    } else if (alivePlayers.length === 1) {
      // Hay un ganador
      showResults(alivePlayers[0]);
    } else if (alivePlayers.length === 0) {
      // Todos perdieron
      showResults(null);
    }
  }, 1000);
}

// Mostrar resultados
function showResults(winner) {
  if (winner) {
    results.textContent = winner.type === "Jugador" 
      ? "¡Ganaste el juego!" 
      : `Perdiste. Ganó el ${winner.type} ${winner.id}.`;
  } else {
    results.textContent = "Todos han caído. ¡Nadie gana!";
  }

  restartBtn.style.display = "block";
}

// Reiniciar el juego
restartBtn.addEventListener("click", startGame);

// Iniciar la partida
startGame();
