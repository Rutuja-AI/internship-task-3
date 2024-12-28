// Variables to track the game state
const board = Array(9).fill(null); // 9 cells, initially empty
let currentPlayer = 'X'; // Player X is the human player
let isGameOver = false;
let gameMode = null; // Can be 'friend' or 'ai'

// Score tracking variables
let xWins = 0;
let oWins = 0;
let draws = 0;

// DOM elements
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const scoreDisplay = document.getElementById('score');
const modeSelection = document.getElementById('mode-selection');

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the board
function createBoard() {
  gameBoard.innerHTML = ''; // Clear any previous board
  board.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index; // Track cell index
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  });
  gameBoard.style.display = 'grid';
}

// Handle cell click for human player
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  // If the cell is already taken or the game is over, do nothing
  if (board[index] || isGameOver || (gameMode === 'ai' && currentPlayer === 'O')) return;

  // Update the board and UI
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  // Check for a winner or tie
  if (checkWinner()) {
    updateScore(currentPlayer);
    isGameOver = true;
  } else if (board.every(cell => cell)) {
    draws++;
    statusDisplay.textContent = 'It\'s a tie! 🤝';
    scoreDisplay.textContent = `X Wins: ${xWins} | O Wins: ${oWins} | Draws: ${draws}`;
    isGameOver = true;
  } else {
    // Switch players and let the AI play if it's the AI's turn
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `${currentPlayer === 'X' ? 'Player X' : 'Player O'}'s turn`;
    
    if (gameMode === 'ai' && currentPlayer === 'O') {
      setTimeout(aiMove, 500); // AI moves after a short delay
    }
  }
}

// Update the score
function updateScore(winner) {
  if (winner === 'X') {
    xWins++;
  } else if (winner === 'O') {
    oWins++;
  }
  scoreDisplay.textContent = `X Wins: ${xWins} | O Wins: ${oWins} | Draws: ${draws}`;
  statusDisplay.textContent = `Player ${winner} wins! 🎉`;
}

// AI's move (Minimax Algorithm)
function aiMove() {
  const bestMove = getBestMove();
  board[bestMove] = 'O'; // AI plays 'O'
  const cell = gameBoard.children[bestMove];
  cell.textContent = 'O';
  cell.classList.add('taken');

  // Check for a winner
  if (checkWinner()) {
    updateScore('O');
    isGameOver = true;
  } else if (board.every(cell => cell)) {
    draws++;
    statusDisplay.textContent = 'It\'s a tie! 🤝';
    scoreDisplay.textContent = `X Wins: ${xWins} | O Wins: ${oWins} | Draws: ${draws}`;
    isGameOver = true;
  } else {
    // Switch back to player X's turn
    currentPlayer = 'X';
    statusDisplay.textContent = `Player X's turn`;
  }
}

// Get the best move for the AI using minimax
function getBestMove() {
  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O'; // Try the AI's move
      const score = minimax(board, false);
      board[i] = null; // Undo the move

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

// Minimax algorithm to evaluate the best move for the AI
function minimax(board, isMaximizing) {
  const winner = checkWinner();
  if (winner === 'O') return 1;
  if (winner === 'X') return -1;
  if (board.every(cell => cell)) return 0; // Tie

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check if there's a winner
function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winner ('X' or 'O')
    }
  }
  return null;
}

// Reset the game
function resetGame() {
  board.fill(null);
  currentPlayer = 'X';
  isGameOver = false;
  statusDisplay.textContent = `Select a mode to start`;
  scoreDisplay.textContent = `X Wins: ${xWins} | O Wins: ${oWins} | Draws: ${draws}`;
  createBoard();
}

// Event listeners for reset button
resetButton.addEventListener('click', resetGame);

// Event listeners for game mode selection
document.getElementById('play-with-friend').addEventListener('click', () => {
  gameMode = 'friend';
  resetGame();
});

document.getElementById('play-with-ai').addEventListener('click', () => {
  gameMode = 'ai';
  resetGame();
});

// Initialize the game
createBoard();
