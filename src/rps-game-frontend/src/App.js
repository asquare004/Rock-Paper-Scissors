import { html, render } from 'lit-html';
import { rps_game_backend } from 'declarations/rps-game-backend';

let playerName = '';
let playerScore = 0;
let highScore = 0;
let highScorePlayer = '';
let isLoading = false;
const choices = ['Rock', 'Paper', 'Scissors'];

const getRandomChoice = () => choices[Math.floor(Math.random() * choices.length)];

// Function to handle the game logic
async function playGame(playerChoice) {
  const computerChoice = getRandomChoice();
  const result = getResult(playerChoice, computerChoice);

  if (result === 'win') {
    playerScore++;
  } else {
    playerScore = 0; // Reset score on loss
  }

  // Update backend with the player's highest score
  if (playerScore > highScore) {
    highScore = playerScore;
    await rps_game_backend.updateHighScore(playerName, highScore);
  }

  const [backendHighScore, backendHighScorePlayer] = await rps_game_backend.getHighScore();
  highScore = Number(backendHighScore); // Ensure highScore is a number
  highScorePlayer = backendHighScorePlayer;

  renderApp(result, playerChoice, computerChoice);
}

// Function to determine the result
function getResult(player, computer) {
  if (player === computer) return 'draw';
  if ((player === 'Rock' && computer === 'Scissors') ||
    (player === 'Paper' && computer === 'Rock') ||
    (player === 'Scissors' && computer === 'Paper')) {
    return 'win';
  }
  return 'lose';
}

// Function to start the game
async function startGame() {
  const inputName = document.getElementById('player-name').value.trim();
  if (inputName) {
    isLoading = true;
    renderApp(); // Re-render with loader
    playerName = inputName;
    playerScore = 0;

    // Get global high score and player from the backend
    const [backendHighScore, backendHighScorePlayer] = await rps_game_backend.getHighScore();
    highScore = Number(backendHighScore); // Convert Nat to number
    highScorePlayer = backendHighScorePlayer;
    
    isLoading = false;
    renderApp(); // Re-render without loader
  }
}

// Function to render the app
function renderApp(result = '', playerChoice = '', computerChoice = '') {
  const template = html`
    <main>
      <h1>Rock Paper Scissors</h1>
      
      ${!playerName ? html`
        <input id="player-name" type="text" placeholder="Enter your name" />
        <button @click=${startGame} ?disabled=${isLoading}>
          ${isLoading ? html`<span class="spinner"></span> Loading...` : 'Start Game'}
        </button>
      ` : html`
        <h2>Welcome, ${playerName}!</h2>
        <p>Global High Score: ${highScore} by ${highScorePlayer}</p>
        <p>Current Score: ${playerScore}</p>
        <div class="choices">
          ${choices.map(choice => html`
            <button @click=${() => playGame(choice)}>
              ${choice}
            </button>
          `)}
        </div>
        ${result ? html`
          <p>Computer chose ${computerChoice}</p>
          <p>You ${result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'draw'}!</p>
        ` : ''}
      `}
    </main>
  `;

  render(template, document.getElementById('root'));
}

// Initial load
renderApp();
