const socket = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'init') {
        updateGameBoard(data.gameState);
        updateMoveHistory(data.gameState.moveHistory);
    } else if (data.type === 'update') {
        updateGameBoard(data.gameState);
        updateMoveHistory(data.gameState.moveHistory);
    } else if (data.type === 'error') {
        alert(data.message);
    }
};

const gameBoard = document.getElementById('game-board');
const statusDiv = document.getElementById('status');

let gameState = null;

const renderBoard = () => {
    gameBoard.innerHTML = '';
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const char = gameState.board[row][col];
            if (char) {
                cell.textContent = char;
                cell.classList.add(char.split('-')[0]); 
            }
            cell.addEventListener('click', () => handleMove(row, col));
            gameBoard.appendChild(cell);
        }
    }
};

const handleMove = (row, col) => {
    const selectedChar = gameState.board[row][col];
    if (selectedChar && selectedChar.startsWith(gameState.currentPlayer)) {
        const move = prompt('Enter move (L, R, F, B):');
        socket.send(JSON.stringify({
            type: 'move',
            player: gameState.currentPlayer,
            character: selectedChar,
            move,
        }));
    }
};

const updateGameBoard = (gameState) => {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const char = gameState.board[i][j];
            if (char) {
                cell.textContent = char;
                cell.addEventListener('click', () => handleCellClick(i, j));
            }
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
};

const updateMoveHistory = (moveHistory) => {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    moveHistory.forEach(move => {
        const listItem = document.createElement('li');
        listItem.textContent = `${move.player} moved ${move.character} to ${move.move}`;
        historyList.appendChild(listItem);
    });
};

const handleCellClick = (i, j) => {
    if (selectedCharacter) {
        const move = getMoveFromCell(i, j);
        if (move) {
            sendMove(selectedCharacter.player, selectedCharacter.name, move);
            selectedCharacter = null;
            validMoves.forEach(moveCell => moveCell.classList.remove('valid-move'));
            validMoves = [];
        }
    } else {
        const char = getCharacterFromCell(i, j);
        if (char) {
            selectedCharacter = { name: char, player: char.charAt(0) }; 
            validMoves = getValidMoves(i, j);
            validMoves.forEach(moveCell => moveCell.classList.add('valid-move'));
        }
    }
};

const getCharacterFromCell = (i, j) => {
    const cell = document.querySelector(`#game-board div:nth-child(${i + 1}) div:nth-child(${j + 1})`);
    return cell ? cell.textContent : null;
};

const getMoveFromCell = (i, j) => {

    const move = `${i}-${j}`; 
    return validMoves.find(moveObj => moveObj.i === i && moveObj.j === j)?.move || null;
};

const getValidMoves = (i, j) => {
    let validMoves = [];
    
    const directions = [
        { i: 1, j: 0, move: 'F' }, 
        { i: -1, j: 0, move: 'B' }, 
        { i: 0, j: 1, move: 'R' }, 
        { i: 0, j: -1, move: 'L' }  
    ];
    directions.forEach(dir => {
        const newI = i + dir.i;
        const newJ = j + dir.j;
        if (isValidCoordinate(newI, newJ)) {
            validMoves.push({ i: newI, j: newJ, move: dir.move });
        }
    });
    return validMoves;
};

const isValidCoordinate = (i, j) => {
    return i >= 0 && i < gridSize && j >= 0 && j < gridSize;
};

const sendMove = (player, character, move) => {
    ws.send(JSON.stringify({ type: 'move', player, character, move }));
};

socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'init' || message.type === 'update') {
        gameState = message.gameState;
        renderBoard();
        statusDiv.textContent = `Player ${gameState.currentPlayer}'s turn`;
    } else if (message.type === 'error') {
        alert(message.message);
    } else if (message.type === 'gameover') {
        alert(`Game Over! Player ${message.winner} wins!`);
    }
});
