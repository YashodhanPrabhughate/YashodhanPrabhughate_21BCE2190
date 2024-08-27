const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const gridSize = 5;
const initialPositions = [
    ['P1', 'H1', 'P2', 'H2', 'P3'], 
    ['P1', 'H1', 'P2', 'H2', 'P3']  
];

let gameState = {
    board: Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)),
    players: {
        A: { characters: [], remaining: 5 },
        B: { characters: [], remaining: 5 }
    },
    currentPlayer: 'A',
    winner: null,
    moveHistory: []
};

const initializeGame = () => {
    
    for (let i = 0; i < gridSize; i++) {
        gameState.board[0][i] = `A-${initialPositions[0][i]}`;
        gameState.players.A.characters.push(`A-${initialPositions[0][i]}`);
    }
    for (let i = 0; i < gridSize; i++) {
        gameState.board[gridSize - 1][i] = `B-${initialPositions[1][i]}`;
        gameState.players.B.characters.push(`B-${initialPositions[1][i]}`);
    }
};

const isValidMove = (player, character, move) => {
    const directions = {
        P: { L: [0, -1], R: [0, 1], F: [1, 0], B: [-1, 0] },
        H1: { L: [0, -2], R: [0, 2], F: [2, 0], B: [-2, 0] },
        H2: { FL: [2, -2], FR: [2, 2], BL: [-2, -2], BR: [-2, 2] }
    };
    
    const isValidMove = (player, character, move) => {
        const [charType, posX, posY] = getPosition(character);
        const [dx, dy] = directions[charType][move];
    
        const newX = posX + dx;
        const newY = posY + dy;
    
        
        if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
            return false;
        }
    
        
        const target = gameState.board[newX][newY];
        if (target && target.startsWith(player)) {
            return false;
        }
    
        return true;
    };
    
    const getPosition = (character) => {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (gameState.board[i][j] === character) {
                    return [character.charAt(2), i, j];
                }
            }
        }
        return null;
    };
    
    return true;
};

const processMove = (player, character, move) => {
    if (!isValidMove(player, character, move)) {
        return { valid: false, message: 'Invalid move' };
    }

    const processMove = (player, character, move) => {
        const [charType, posX, posY] = getPosition(character);
        const [dx, dy] = directions[charType][move];
    
        const newX = posX + dx;
        const newY = posY + dy;
    
        if (!isValidMove(player, character, move)) {
            return { valid: false, message: 'Invalid move' };
        }
    
        const target = gameState.board[newX][newY];
        if (target && !target.startsWith(player)) {
            
            const opponent = target.charAt(0);
            gameState.players[opponent].characters = gameState.players[opponent].characters.filter(c => c !== target);
            gameState.players[opponent].remaining--;
        }
    
        gameState.board[posX][posY] = null;
        gameState.board[newX][newY] = character;
    
        if (gameState.players.A.remaining === 0 || gameState.players.B.remaining === 0) {
            gameState.winner = player;
        }
    
        gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';

        gameState.moveHistory.push({ player, character, move });
    
        return { valid: true, gameState };
    };
    

    if (gameState.players.B.remaining === 0 || gameState.players.A.remaining === 0) {
        gameState.winner = player;
    }

    
    gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';

    return { valid: true, gameState };
};

const broadcast = (message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const { type, player, character, move } = JSON.parse(message);

        if (type === 'move') {
            const result = processMove(player, character, move);
            if (result.valid) {
                broadcast(JSON.stringify({ type: 'update', gameState }));
            } else {
                ws.send(JSON.stringify({ type: 'error', message: result.message }));
            }
        }
    });

    ws.send(JSON.stringify({ type: 'init', gameState }));
});


initializeGame();
