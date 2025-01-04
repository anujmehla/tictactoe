const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left
    [2, 4, 6], // Diagonal from top-right
];

// Create game board
function createBoard() {
    board.innerHTML = ''; // Clear the board
    gameState.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.dataset.index = index;
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', handleCellClick);
        board.appendChild(cellDiv);
    });
}

// Handle cell click
function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (gameState[index] !== '' || !gameActive) return;

    gameState[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add('taken');

    if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (gameState.every((cell) => cell !== '')) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Check if there is a winner
function checkWinner() {
    return WINNING_COMBINATIONS.some((combination) => {
        const [a, b, c] = combination;
        return (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[b] === gameState[c]
        );
    });
}

// Restart the game
restartBtn.addEventListener('click', () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    createBoard();
});

// Initialize game
createBoard();
statusText.textContent = `Player ${currentPlayer}'s turn`;
