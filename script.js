const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const darkModeToggle = document.getElementById('darkModeToggle');

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

// AI move logic with Minimax
function aiMove() {
    const bestMove = minimax(gameState, 'O').index;
    makeMove(bestMove, 'O');

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

// Minimax Algorithm
function minimax(state, player) {
    const availableMoves = state
        .map((cell, index) => (cell === '' ? index : null))
        .filter((index) => index !== null);

    // Check for terminal states
    if (checkWinnerForPlayer(state, 'X')) return { score: -10 };
    if (checkWinnerForPlayer(state, 'O')) return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    const moves = [];

    // Loop through available moves
    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        state[availableMoves[i]] = player;

        if (player === 'O') {
            const result = minimax(state, 'X');
            move.score = result.score;
        } else {
            const result = minimax(state, 'O');
            move.score = result.score;
        }

        state[availableMoves[i]] = ''; // Undo move
        moves.push(move);
    }

    // Choose the best move
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

// Check for a winner in a given state
function checkWinnerForPlayer(state, player) {
    return WINNING_COMBINATIONS.some((combination) => {
        const [a, b, c] = combination;
        return (
            state[a] === player && state[b] === player && state[c] === player
        );
    });
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

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkModeToggle.checked);
});

// Initialize game
createBoard();
statusText.textContent = `Player ${currentPlayer}'s turn`;
