const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isSinglePlayer = true; // Set to true for single-player mode

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

    makeMove(index, currentPlayer);

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

    if (isSinglePlayer && currentPlayer === 'O') {
        setTimeout(aiMove, 500); // Give a slight delay for AI moves
    } else {
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Make a move
function makeMove(index, player) {
    gameState[index] = player;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.textContent = player;
    cell.classList.add('taken');
}

// AI move logic
function aiMove() {
    // Find the best available move
    const availableMoves = gameState
        .map((cell, index) => (cell === '' ? index : null))
        .filter((index) => index !== null);

    let move;

    // Simple strategy: Try to win, block, or pick randomly
    move =
        findWinningMove('O') ||
        findWinningMove('X') ||
        pickRandomMove(availableMoves);

    if (move !== null) {
        makeMove(move, 'O');
        if (checkWinner()) {
            statusText.textContent = `Player O (AI) wins!`;
            gameActive = false;
            return;
        }

        if (gameState.every((cell) => cell !== '')) {
            statusText.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Check for a winning move
function findWinningMove(player) {
    for (let combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const values = [gameState[a], gameState[b], gameState[c]];

        if (
            values.filter((value) => value === player).length === 2 &&
            values.includes('')
        ) {
            return combination[values.indexOf('')];
        }
    }
    return null;
}

// Pick a random move from available moves
function pickRandomMove(availableMoves) {
    return availableMoves.length > 0
        ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
        : null;
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
