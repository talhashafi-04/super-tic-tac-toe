document.addEventListener("DOMContentLoaded", function () {
    
    const playerName = new URLSearchParams(window.location.search).get('name');
    const roomCode = new URLSearchParams(window.location.search).get('room') || null;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const socket = new WebSocket(`${protocol}://${window.location.host}/ws/game?name=${encodeURIComponent(playerName)}${roomCode ? `&room=${roomCode}` : ''}`);
    
    let players = []; // Store players array here
    let currentPlayer = '';
    let gameState = 'waiting';
    let nextBoardIndex = -1; // -1 means player can choose any board

    socket.onopen = () => {
        console.log('Connected to server');
        document.getElementById('gameArea').style.display = 'block';
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'state') {
            updateSuperBoard(data.superBoard, data.localBoards, data.nextBoardIndex);
            updatePlayers(data.players, data.spectators);
            updateTurnIndicator(data.currentPlayer, data.gameState, data.players);
            updateNextBoardIndicator(data.nextBoardIndex);
            nextBoardIndex = data.nextBoardIndex;
            currentPlayer = data.currentPlayer; // Update currentPlayer with server data
            gameState = data.gameState; // Update gameState with server data
            if (data.gameState !== 'waiting' && data.gameState !== 'playing') {
                updateGameStatusDisplay(data.gameState, data.winner);
            }
        } else if (data.type === 'chat') {
            addChatMessage(data.sender, data.message);
        } else if (data.type === 'roomInfo') {
            updateRoomCode(data.room);
        } else if (data.type === 'playerJoined') {
            // Handle player joined event separately to update player list immediately
            if (data.players) {
                updatePlayers(data.players, data.spectators || []);
            }
            updateTurnIndicator('X', 'playing', data.players);
            updateNextBoardIndicator(nextBoardIndex);
           
        }
        else if (data.type === 'playerLeft') {
            // Handle player left event
            if (data.players) {
                updatePlayers(data.players, data.spectators || []);
            }
            // Chat message is already handled separately
        }
    };

    function updateRoomCode(roomCode) {
        const roomCodeDisplay = document.getElementById('roomCodeDisplay');
        roomCodeDisplay.innerText = roomCode;
        
        // Make the room code element clickable for copying
        const roomCodeContainer = roomCodeDisplay.parentElement;
        roomCodeContainer.style.cursor = 'pointer';
        roomCodeContainer.title = 'Click to copy room code';
        roomCodeContainer.onclick = () => {
            navigator.clipboard.writeText(roomCode)
                .then(() => {
                    // Show copy confirmation
                    const originalText = roomCodeContainer.innerHTML;
                    roomCodeContainer.innerHTML = `<i class="fas fa-check"></i> Copied!`;
                    setTimeout(() => {
                        roomCodeContainer.innerHTML = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        };
    }

    function updateSuperBoard(superBoard, localBoards, nextBoardIndex) {
        const superBoardElement = document.getElementById('superBoard');
        superBoardElement.innerHTML = '';
        
        // Create 9 local boards
        for (let i = 0; i < 9; i++) {
            const localBoardElement = document.createElement('div');
            localBoardElement.classList.add('local-board');
            
            // Add classes based on the board state
            if (superBoard[i] === 'X') {
                localBoardElement.classList.add('won-x');
            } else if (superBoard[i] === 'O') {
                localBoardElement.classList.add('won-o');
            } else if (superBoard[i] === 'T') {
                localBoardElement.classList.add('tie');
            } else {
                // If this is the next board to play on, highlight it
                if (nextBoardIndex === -1 || nextBoardIndex === i) {
                    localBoardElement.classList.add('active');
                } else {
                    localBoardElement.classList.add('inactive');
                }
            }
            
            // Create 9 cells for each local board
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                const globalIndex = i * 9 + j;
                
                if (localBoards[globalIndex] === 'X') {
                    cell.classList.add('x');
                    cell.innerHTML = '<i class="fas fa-times"></i>';
                } else if (localBoards[globalIndex] === 'O') {
                    cell.classList.add('o');
                    cell.innerHTML = '<i class="fas fa-circle"></i>';
                }
                
                // Disable cell if:
                // 1. The local board is already won or tied
                // 2. This is not the active board (unless all boards are active)
                // 3. The cell is already filled
                if (superBoard[i] || (nextBoardIndex !== -1 && nextBoardIndex !== i) || localBoards[globalIndex]) {
                    cell.classList.add('disabled');
                } else {
                    cell.onclick = () => makeMove(globalIndex);
                }
                
                localBoardElement.appendChild(cell);
            }
            
            superBoardElement.appendChild(localBoardElement);
        }
    }

    function updateNextBoardIndicator(nextBoardIndex) {
        const indicator = document.getElementById('nextBoardIndicator');
        
        if (nextBoardIndex === -1) {
            indicator.innerHTML = '<i class="fas fa-chess-board"></i> Play anywhere';
        } else {
            const boardPositions = ['Top-Left', 'Top-Middle', 'Top-Right', 'Middle-Left', 'Middle', 'Middle-Right', 'Bottom-Left', 'Bottom-Middle', 'Bottom-Right'];
            indicator.innerHTML = `<i class="fas fa-chess-board"></i> Next play: ${boardPositions[nextBoardIndex]} board`;
        }
    }

    function updatePlayers(serverPlayers, spectators) {
        // Store the players array in the global variable
        players = serverPlayers;
        
        const playerListElement = document.getElementById('playerList');
        const spectatorList = document.getElementById('spectatorList');
        
        playerListElement.innerHTML = '';
        if (players.length === 0) {
            playerListElement.innerHTML = '<li>Waiting for players...</li>';
        } else {
            players.forEach((player, index) => {
                const li = document.createElement('li');
                const symbol = index === 0 ? ' (X)' : ' (O)';
                li.innerHTML = player === playerName ? 
                    `<i class="fas fa-user-circle"></i> ${player}${symbol} (You)` : 
                    `${player}${symbol}`;
                playerListElement.appendChild(li);
            });
        }
        
        spectatorList.innerHTML = '';
        if (spectators.length === 0) {
            spectatorList.innerHTML = '<li>No spectators</li>';
        } else {
            spectators.forEach(spectator => {
                const li = document.createElement('li');
                li.innerHTML = spectator === playerName ? 
                    `<i class="fas fa-user-circle"></i> ${spectator} (You)` : 
                    spectator;
                spectatorList.appendChild(li);
            });
        }
    }

    function updateTurnIndicator(playerTurn, gameState, playersList) {
        const turnIndicator = document.getElementById('turnIndicator');
        
        if (gameState === 'waiting') {
            turnIndicator.innerHTML = '<i class="fas fa-circle-play"></i> Waiting for players...';
        } else if (gameState === 'playing') {
            // Find which player is currently playing
            const playerIndex = playerTurn === 'X' ? 0 : 1;
            const currentPlayerName = playersList && playersList.length > playerIndex ? playersList[playerIndex] : playerTurn;
            
            const playerSymbol = playerTurn === 'X' ? 
                '<i class="fas fa-times" style="color: var(--primary);"></i>' : 
                '<i class="fas fa-circle" style="color: var(--secondary);"></i>';
                
            // Display player's name instead of just symbol
            turnIndicator.innerHTML = `${playerSymbol} ${currentPlayerName}'s turn (${playerTurn})`;
        } else if (gameState === 'win') {
            turnIndicator.innerHTML = `<i class="fas fa-trophy"></i> Game over`;
        } else if (gameState === 'draw') {
            turnIndicator.innerHTML = `<i class="fas fa-handshake"></i> Game over`;
        }
    }

    function updateGameStatusDisplay(gameState, winner) {
        const gameStatus = document.getElementById('gameStatus');
        
        gameStatus.classList.add('active');
        
        if (gameState === 'win') {
            // Find the player name associated with the winning symbol
            const winnerPlayerIndex = winner === 'X' ? 0 : 1;
            const winnerName = players.length > winnerPlayerIndex ? players[winnerPlayerIndex] : winner;
            
            gameStatus.innerHTML = `<i class="fas fa-crown"></i> ${winnerName} (${winner}) wins!`;
            gameStatus.classList.add('win');
            gameStatus.classList.remove('draw');
        } else if (gameState === 'draw') {
            gameStatus.innerHTML = `<i class="fas fa-balance-scale"></i> Game ended in a draw!`;
            gameStatus.classList.add('draw');
            gameStatus.classList.remove('win');
        }
    }
    
    // Client-side validation
    function makeMove(index) {
        // Check if it's my turn
        const mySymbol = players[0] === playerName ? 'X' : 'O';
        if (currentPlayer !== mySymbol) {
            addChatMessage('System', "It's not your turn yet!", false);
            return;
        }
        
        socket.send(JSON.stringify({ type: 'move', index }));
    }

    function sendChat() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (message) {
            socket.send(JSON.stringify({ type: 'chat', message }));
            input.value = '';
            
            // Add message locally with "self" styling
            addChatMessage(playerName, message, true);
        }
    }

    function addChatMessage(sender, message, isSelf = false) {
        const chatBox = document.getElementById('chatBox');
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message');
        msgDiv.classList.add(isSelf ? 'self' : 'other');
        
        const senderDiv = document.createElement('div');
        senderDiv.classList.add('sender');
        senderDiv.innerText = sender;
        
        const contentDiv = document.createElement('div');
        contentDiv.innerText = message;
        
        msgDiv.appendChild(senderDiv);
        msgDiv.appendChild(contentDiv);
        
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Toggle rules
    document.getElementById('rulesToggle').addEventListener('click', function() {
        const rulesContent = document.getElementById('rulesContent');
        rulesContent.classList.toggle('active');
    });

    // Handle socket closure
    socket.onclose = () => {
        console.log('Connection closed');
        addChatMessage('System', 'Connection lost. Please refresh the page.', false);
        document.getElementById('turnIndicator').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Connection lost';
        document.getElementById('turnIndicator').style.backgroundColor = '#e74c3c';
    };

    // Handle socket errors
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        addChatMessage('System', 'Connection error. Please refresh the page.', false);
    };

    // Allow chat input to also send on Enter key
    document.getElementById('chatInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendChat();
        }
    });

    
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChat);
    }
});