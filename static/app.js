// document.addEventListener("DOMContentLoaded", function () {
    
//     const playerName = new URLSearchParams(window.location.search).get('name');
//     const roomCode = new URLSearchParams(window.location.search).get('room') || null;

//     const protocol = window.location.protocol === "https:" ? "wss" : "ws";

//     const socket = new WebSocket(`${protocol}://${window.location.host}/ws/game?name=${encodeURIComponent(playerName)}${roomCode ? `&room=${roomCode}` : ''}`);
    
//     let players = []; // Store players array here
//     let currentPlayer = '';
//     let gameState = 'waiting';
//     let nextBoardIndex = -1; // -1 means player can choose any board

//     socket.onopen = () => {
//         console.log('Connected to server');
//         document.getElementById('gameArea').style.display = 'block';
//     };

//     socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);

//         if (data.type === 'state') {
//             updateSuperBoard(data.superBoard, data.localBoards, data.nextBoardIndex);
//             updatePlayers(data.players, data.spectators);
//             updateTurnIndicator(data.currentPlayer, data.gameState, data.players);
//             updateNextBoardIndicator(data.nextBoardIndex);
//             nextBoardIndex = data.nextBoardIndex;
//             currentPlayer = data.currentPlayer; // Update currentPlayer with server data
//             gameState = data.gameState; // Update gameState with server data
//             if (data.gameState !== 'waiting' && data.gameState !== 'playing') {
//                 updateGameStatusDisplay(data.gameState, data.winner);
//             }
//         } else if (data.type === 'chat') {
//             addChatMessage(data.sender, data.message);
//         } else if (data.type === 'roomInfo') {
//             updateRoomCode(data.room);
//         } else if (data.type === 'playerJoined') {
//             // Handle player joined event separately to update player list immediately
//             if (data.players) {
//                 updatePlayers(data.players, data.spectators || []);
//             }
//             updateTurnIndicator('X', 'playing', data.players);
//             updateNextBoardIndicator(nextBoardIndex);
           
//         }
//         else if (data.type === 'playerLeft') {
//             // Handle player left event
//             if (data.players) {
//                 updatePlayers(data.players, data.spectators || []);
//             }
//             // Chat message is already handled separately
//         }
//     };

//     function updateRoomCode(roomCode) {
//         const roomCodeDisplay = document.getElementById('roomCodeDisplay');
//         roomCodeDisplay.innerText = roomCode;
        
//         // Make the room code element clickable for copying
//         const roomCodeContainer = roomCodeDisplay.parentElement;
//         roomCodeContainer.style.cursor = 'pointer';
//         roomCodeContainer.title = 'Click to copy room code';
//         roomCodeContainer.onclick = () => {
//             navigator.clipboard.writeText(roomCode)
//                 .then(() => {
//                     // Show copy confirmation
//                     const originalText = roomCodeContainer.innerHTML;
//                     roomCodeContainer.innerHTML = `<i class="fas fa-check"></i> Copied!`;
//                     setTimeout(() => {
//                         roomCodeContainer.innerHTML = originalText;
//                     }, 1500);
//                 })
//                 .catch(err => {
//                     console.error('Failed to copy: ', err);
//                 });
//         };
//     }

//     function updateSuperBoard(superBoard, localBoards, nextBoardIndex) {
//         const superBoardElement = document.getElementById('superBoard');
//         superBoardElement.innerHTML = '';
        
//         // Create 9 local boards
//         for (let i = 0; i < 9; i++) {
//             const localBoardElement = document.createElement('div');
//             localBoardElement.classList.add('local-board');
            
//             // Add classes based on the board state
//             if (superBoard[i] === 'X') {
//                 localBoardElement.classList.add('won-x');
//             } else if (superBoard[i] === 'O') {
//                 localBoardElement.classList.add('won-o');
//             } else if (superBoard[i] === 'T') {
//                 localBoardElement.classList.add('tie');
//             } else {
//                 // If this is the next board to play on, highlight it
//                 if (nextBoardIndex === -1 || nextBoardIndex === i) {
//                     localBoardElement.classList.add('active');
//                 } else {
//                     localBoardElement.classList.add('inactive');
//                 }
//             }
            
//             // Create 9 cells for each local board
//             for (let j = 0; j < 9; j++) {
//                 const cell = document.createElement('div');
//                 cell.classList.add('cell');
                
//                 const globalIndex = i * 9 + j;
                
//                 if (localBoards[globalIndex] === 'X') {
//                     cell.classList.add('x');
//                     cell.innerHTML = '<i class="fas fa-times"></i>';
//                 } else if (localBoards[globalIndex] === 'O') {
//                     cell.classList.add('o');
//                     cell.innerHTML = '<i class="fas fa-circle"></i>';
//                 }
                
//                 // Disable cell if:
//                 // 1. The local board is already won or tied
//                 // 2. This is not the active board (unless all boards are active)
//                 // 3. The cell is already filled
//                 if (superBoard[i] || (nextBoardIndex !== -1 && nextBoardIndex !== i) || localBoards[globalIndex]) {
//                     cell.classList.add('disabled');
//                 } else {
//                     cell.onclick = () => makeMove(globalIndex);
//                 }
                
//                 localBoardElement.appendChild(cell);
//             }
            
//             superBoardElement.appendChild(localBoardElement);
//         }
//     }

//     function updateNextBoardIndicator(nextBoardIndex) {
//         const indicator = document.getElementById('nextBoardIndicator');
        
//         if (nextBoardIndex === -1) {
//             indicator.innerHTML = '<i class="fas fa-chess-board"></i> Play anywhere';
//         } else {
//             const boardPositions = ['Top-Left', 'Top-Middle', 'Top-Right', 'Middle-Left', 'Middle', 'Middle-Right', 'Bottom-Left', 'Bottom-Middle', 'Bottom-Right'];
//             indicator.innerHTML = `<i class="fas fa-chess-board"></i> Next play: ${boardPositions[nextBoardIndex]} board`;
//         }
//     }

//     function updatePlayers(serverPlayers, spectators) {
//         // Store the players array in the global variable
//         players = serverPlayers;
        
//         const playerListElement = document.getElementById('playerList');
//         const spectatorList = document.getElementById('spectatorList');
        
//         playerListElement.innerHTML = '';
//         if (players.length === 0) {
//             playerListElement.innerHTML = '<li>Waiting for players...</li>';
//         } else {
//             players.forEach((player, index) => {
//                 const li = document.createElement('li');
//                 const symbol = index === 0 ? ' (X)' : ' (O)';
//                 li.innerHTML = player === playerName ? 
//                     `<i class="fas fa-user-circle"></i> ${player}${symbol} (You)` : 
//                     `${player}${symbol}`;
//                 playerListElement.appendChild(li);
//             });
//         }
        
//         spectatorList.innerHTML = '';
//         if (spectators.length === 0) {
//             spectatorList.innerHTML = '<li>No spectators</li>';
//         } else {
//             spectators.forEach(spectator => {
//                 const li = document.createElement('li');
//                 li.innerHTML = spectator === playerName ? 
//                     `<i class="fas fa-user-circle"></i> ${spectator} (You)` : 
//                     spectator;
//                 spectatorList.appendChild(li);
//             });
//         }
//     }

//     function updateTurnIndicator(playerTurn, gameState, playersList) {
//         const turnIndicator = document.getElementById('turnIndicator');
        
//         if (gameState === 'waiting') {
//             turnIndicator.innerHTML = '<i class="fas fa-circle-play"></i> Waiting for players...';
//         } else if (gameState === 'playing') {
//             // Find which player is currently playing
//             const playerIndex = playerTurn === 'X' ? 0 : 1;
//             const currentPlayerName = playersList && playersList.length > playerIndex ? playersList[playerIndex] : playerTurn;
            
//             const playerSymbol = playerTurn === 'X' ? 
//                 '<i class="fas fa-times" style="color: var(--primary);"></i>' : 
//                 '<i class="fas fa-circle" style="color: var(--secondary);"></i>';
                
//             // Display player's name instead of just symbol
//             turnIndicator.innerHTML = `${playerSymbol} ${currentPlayerName}'s turn (${playerTurn})`;
//         } else if (gameState === 'win') {
//             turnIndicator.innerHTML = `<i class="fas fa-trophy"></i> Game over`;
//         } else if (gameState === 'draw') {
//             turnIndicator.innerHTML = `<i class="fas fa-handshake"></i> Game over`;
//         }
//     }

//     function updateGameStatusDisplay(gameState, winner) {
//         const gameStatus = document.getElementById('gameStatus');
        
//         gameStatus.classList.add('active');
        
//         if (gameState === 'win') {
//             // Find the player name associated with the winning symbol
//             const winnerPlayerIndex = winner === 'X' ? 0 : 1;
//             const winnerName = players.length > winnerPlayerIndex ? players[winnerPlayerIndex] : winner;
            
//             gameStatus.innerHTML = `<i class="fas fa-crown"></i> ${winnerName} (${winner}) wins!`;
//             gameStatus.classList.add('win');
//             gameStatus.classList.remove('draw');
//         } else if (gameState === 'draw') {
//             gameStatus.innerHTML = `<i class="fas fa-balance-scale"></i> Game ended in a draw!`;
//             gameStatus.classList.add('draw');
//             gameStatus.classList.remove('win');
//         }
//     }
    
//     // Client-side validation
//     function makeMove(index) {
//         // Check if it's my turn
//         const mySymbol = players[0] === playerName ? 'X' : 'O';
//         if (currentPlayer !== mySymbol) {
//             addChatMessage('System', "It's not your turn yet!", false);
//             return;
//         }
        
//         socket.send(JSON.stringify({ type: 'move', index }));
//     }

//     function sendChat() {
//         const input = document.getElementById('chatInput');
//         const message = input.value.trim();
//         if (message) {
//             socket.send(JSON.stringify({ type: 'chat', message }));
//             input.value = '';
            
//             // Add message locally with "self" styling
//             addChatMessage(playerName, message, true);
//         }
//     }

//     function addChatMessage(sender, message, isSelf = false) {
//         const chatBox = document.getElementById('chatBox');
//         const msgDiv = document.createElement('div');
//         msgDiv.classList.add('chat-message');
//         msgDiv.classList.add(isSelf ? 'self' : 'other');
        
//         const senderDiv = document.createElement('div');
//         senderDiv.classList.add('sender');
//         senderDiv.innerText = sender;
        
//         const contentDiv = document.createElement('div');
//         contentDiv.innerText = message;
        
//         msgDiv.appendChild(senderDiv);
//         msgDiv.appendChild(contentDiv);
        
//         chatBox.appendChild(msgDiv);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }

//     // Toggle rules
//     document.getElementById('rulesToggle').addEventListener('click', function() {
//         const rulesContent = document.getElementById('rulesContent');
//         rulesContent.classList.toggle('active');
//     });

//     // Handle socket closure
//     socket.onclose = () => {
//         console.log('Connection closed');
//         addChatMessage('System', 'Connection lost. Please refresh the page.', false);
//         document.getElementById('turnIndicator').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Connection lost';
//         document.getElementById('turnIndicator').style.backgroundColor = '#e74c3c';
//     };

//     // Handle socket errors
//     socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         addChatMessage('System', 'Connection error. Please refresh the page.', false);
//     };

//     // Allow chat input to also send on Enter key
//     document.getElementById('chatInput').addEventListener('keydown', function(event) {
//         if (event.key === 'Enter') {
//             sendChat();
//         }
//     });

    
//     const sendBtn = document.querySelector('.send-btn');
//     if (sendBtn) {
//         sendBtn.addEventListener('click', sendChat);
//     }
// });




document.addEventListener("DOMContentLoaded", function () {


    // Get player name and room code from URL parameters
    const playerName = new URLSearchParams(window.location.search).get('name');
    const roomCode = new URLSearchParams(window.location.search).get('room') || null;

    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws/game?name=${encodeURIComponent(playerName)}${roomCode ? `&room=${roomCode}` : ''}`);
    
    // Game state variables
    let players = [];
    let spectators = [];
    let currentPlayer = '';
    let gameState = 'waiting';
    let nextBoardIndex = -1; // -1 means player can choose any board
    let isConfettiActive = false;

    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#a29bfe" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#6c5ce7",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // WebSocket event handlers
    socket.onopen = () => {
        console.log('Connected to server');
        document.getElementById('gameArea').style.display = 'block';
    };


    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case 'state':
                updateSuperBoard(data.superBoard, data.localBoards, data.nextBoardIndex);
                updatePlayers(data.players, data.spectators);
                updateTurnIndicator(data.currentPlayer, data.gameState, data.players);
                updateNextBoardIndicator(data.nextBoardIndex);
                nextBoardIndex = data.nextBoardIndex;
                currentPlayer = data.currentPlayer;
                gameState = data.gameState;
                
                // If game is over, show game status
                if (data.gameState !== 'waiting' && data.gameState !== 'playing') {
                    updateGameStatusDisplay(data.gameState, data.winner);
                }
                break;
                
            case 'chat':
                addChatMessage(data.sender, data.message);
                break;
                
            case 'roomInfo':
                updateRoomCode(data.room);
                break;
                
            case 'playerJoined':
                // Update player list immediately when a new player joins
                if (data.players) {
                    updatePlayers(data.players, data.spectators || []);
                }
                updateTurnIndicator('X', 'playing', data.players);
                updateNextBoardIndicator(nextBoardIndex);
                addChatMessage('System', `${data.player} has joined the game.`);
                break;
                
            case 'playerLeft':
                // Update player list when a player leaves
                if (data.players) {
                    updatePlayers(data.players, data.spectators || []);
                }
                addChatMessage('System', `${data.player} has left the game.`);
                break;
        }
    };

    // Update room code display
    function updateRoomCode(roomCode) {
        const roomCodeDisplay = document.getElementById('roomCodeDisplay');
        roomCodeDisplay.innerText = roomCode;
        
        // Make the room code element clickable for copying
        const roomCodeContainer = roomCodeDisplay.parentElement;
        roomCodeContainer.style.cursor = 'pointer';
        roomCodeContainer.onclick = () => {
            navigator.clipboard.writeText(roomCode)
                .then(() => {
                    // Show copy confirmation
                    const originalText = roomCodeDisplay.innerText;
                    roomCodeDisplay.innerText = 'Copied!';
                    setTimeout(() => {
                        roomCodeDisplay.innerText = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        };
    }

    // Update the super board with the current game state
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
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-times';
                    cell.appendChild(icon);
                } else if (localBoards[globalIndex] === 'O') {
                    cell.classList.add('o');
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-circle';
                    cell.appendChild(icon);
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

    // Update the next board indicator
    function updateNextBoardIndicator(nextBoardIndex) {
        const indicator = document.getElementById('nextBoardIndicator');
        
        if (nextBoardIndex === -1) {
            indicator.innerHTML = '<i class="fas fa-chess-board"></i> Play anywhere';
        } else {
            const boardPositions = ['Top-Left', 'Top-Middle', 'Top-Right', 'Middle-Left', 'Middle', 'Middle-Right', 'Bottom-Left', 'Bottom-Middle', 'Bottom-Right'];
            indicator.innerHTML = `<i class="fas fa-chess-board"></i> Next play: ${boardPositions[nextBoardIndex]} board`;
        }
    }

    // Update player lists
    function updatePlayers(serverPlayers, serverSpectators) {
        // Store the players and spectators arrays in the global variables
        players = serverPlayers || [];
        spectators = serverSpectators || [];
        
        const playerListElement = document.getElementById('playerList');
        const spectatorListElement = document.getElementById('spectatorList');
        
        // Update player list
        playerListElement.innerHTML = '';
        if (players.length === 0) {
            playerListElement.innerHTML = '<li>Waiting for players...</li>';
        } else {
            players.forEach((player, index) => {
                const li = document.createElement('li');
                const symbol = index === 0 ? ' (X)' : ' (O)';
                
                // Mark the current player
                if (player === playerName) {
                    li.innerHTML = `<i class="fas fa-user-circle"></i> ${player}${symbol} <span style="opacity:0.7">(You)</span>`;
                } else {
                    li.innerHTML = `${player}${symbol}`;
                }
                
                playerListElement.appendChild(li);
            });
        }
        
        // Update spectator list
        spectatorListElement.innerHTML = '';
        if (spectators.length === 0) {
            spectatorListElement.innerHTML = '<li>No spectators</li>';
        } else {
            spectators.forEach(spectator => {
                const li = document.createElement('li');
                
                // Mark the current spectator
                if (spectator === playerName) {
                    li.innerHTML = `<i class="fas fa-user-circle"></i> ${spectator} <span style="opacity:0.7">(You)</span>`;
                } else {
                    li.innerHTML = spectator;
                }
                
                spectatorListElement.appendChild(li);
            });
        }
    }

    // Update turn indicator
    function updateTurnIndicator(playerTurn, gameState, playersList) {
        const turnIndicator = document.getElementById('turnIndicator');
        
        if (gameState === 'waiting') {
            turnIndicator.innerHTML = '<i class="fas fa-circle-play pulse-icon"></i> Waiting for players...';
            turnIndicator.style.backgroundColor = 'var(--primary-light)';
        } else if (gameState === 'playing') {
            // Find which player is currently playing
            const playerIndex = playerTurn === 'X' ? 0 : 1;
            const currentPlayerName = playersList && playersList.length > playerIndex ? playersList[playerIndex] : playerTurn;
            
            const isYourTurn = playersList[playerIndex] === playerName;
            const playerSymbol = playerTurn === 'X' ? 
                '<i class="fas fa-times" style="color: var(--light);"></i>' : 
                '<i class="fas fa-circle" style="color: var(--light);"></i>';
                
            // Add a pulsing effect if it's your turn
            if (isYourTurn) {
                turnIndicator.innerHTML = `${playerSymbol} Your turn! (${playerTurn})`;
                turnIndicator.style.backgroundColor = playerTurn === 'X' ? 'var(--primary)' : 'var(--secondary)';
                turnIndicator.classList.add('active-turn');
            } else {
                turnIndicator.innerHTML = `${playerSymbol} ${currentPlayerName}'s turn (${playerTurn})`;
                turnIndicator.style.backgroundColor = playerTurn === 'X' ? 'var(--primary-light)' : 'var(--secondary-light)';
                turnIndicator.classList.remove('active-turn');
            }
        } else if (gameState === 'win') {
            turnIndicator.innerHTML = '<i class="fas fa-trophy"></i> Game over';
            turnIndicator.style.backgroundColor = 'var(--success)';
            turnIndicator.classList.remove('active-turn');
        } else if (gameState === 'draw') {
            turnIndicator.innerHTML = '<i class="fas fa-handshake"></i> Game over';
            turnIndicator.style.backgroundColor = 'var(--warning)';
            turnIndicator.classList.remove('active-turn');
        }
    }

    // Update game status when game ends
    function updateGameStatusDisplay(gameState, winner) {
        const gameStatus = document.getElementById('gameStatus');
        const statusContent = gameStatus.querySelector('.status-content') || gameStatus;
        
        gameStatus.classList.add('active');
        
        if (gameState === 'win') {
            // Find the player name associated with the winning symbol
            const winnerPlayerIndex = winner === 'X' ? 0 : 1;
            const winnerName = players.length > winnerPlayerIndex ? players[winnerPlayerIndex] : winner;
            
            const isYouWinner = players[winnerPlayerIndex] === playerName;
            
            if (isYouWinner) {
                statusContent.innerHTML = `<i class="fas fa-crown"></i> You won!`;
            } else {
                statusContent.innerHTML = `<i class="fas fa-crown"></i> ${winnerName} (${winner}) wins!`;
            }
            
            // Apply styling
            gameStatus.classList.add('win');
            gameStatus.classList.remove('draw');
            
            // Show confetti for winner
            if (isYouWinner && !isConfettiActive) {
                showConfetti();
            }
        } else if (gameState === 'draw') {
            statusContent.innerHTML = `<i class="fas fa-balance-scale"></i> Game ended in a draw!`;
            gameStatus.classList.add('draw');
            gameStatus.classList.remove('win');
        }
    }
    
    // Generate confetti celebration effect
    function showConfetti() {
        isConfettiActive = true;
        
        const confettiContainer = document.getElementById('confettiContainer');
        
        // Create confetti elements
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Randomize confetti properties
            const size = Math.floor(Math.random() * 10) + 5; // 5-15px
            const color = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'][Math.floor(Math.random() * 7)];
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            
            // Randomize position and animation
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
            confetti.style.animationDelay = `${Math.random() * 3}s`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confettiContainer.innerHTML = '';
            isConfettiActive = false;
        }, 5000);
    }
    
    // Client-side validation for making a move
    function makeMove(index) {
        // Check if it's my turn
        const mySymbol = players[0] === playerName ? 'X' : players[1] === playerName ? 'O' : null;
        
        // If I'm a spectator or it's not my turn
        if (!mySymbol || currentPlayer !== mySymbol) {
            addChatMessage('System', "It's not your turn!", true);
            return;
        }
        
        // If game is not in playing state
        if (gameState !== 'playing') {
            addChatMessage('System', "The game is not active!", true);
            return;
        }
        
        socket.send(JSON.stringify({ type: 'move', index }));
    }

    // Send chat message
    function sendChat() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (message) {
            // Send message to server
            socket.send(JSON.stringify({ type: 'chat', message }));
            input.value = '';
            
            // Add your own message locally with "self" styling
            addChatMessage(playerName, message, true); // isSelf = true
        }
    }

    function addChatMessage(sender, message, isSelf = false) {
        const chatBox = document.getElementById('chatBox');
        const msgDiv = document.createElement('div');
        
        // Determine if the message is from yourself
        const isOwnMessage = sender === playerName;
        
        // Apply appropriate styling
        msgDiv.classList.add('chat-message');
        msgDiv.classList.add(isOwnMessage ? 'self' : 'other');
        
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

    // Handle socket closure
    socket.onclose = () => {
        console.log('Connection closed');
        addChatMessage('System', 'Connection lost. Please refresh the page.', true);
        
        const turnIndicator = document.getElementById('turnIndicator');
        turnIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Connection lost';
        turnIndicator.style.backgroundColor = 'var(--danger)';
        turnIndicator.classList.remove('active-turn');
    };

    // Handle socket errors
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        addChatMessage('System', 'Connection error. Please refresh the page.', true);
    };

    // Toggle rules
    document.getElementById('rulesToggle').addEventListener('click', function() {
        const rulesContent = document.getElementById('rulesContent');
        const rulesArrow = document.querySelector('.rules-arrow');
        
        rulesContent.classList.toggle('active');
        
        if (rulesContent.classList.contains('active')) {
            rulesArrow.classList.add('fa-chevron-up');
            rulesArrow.classList.remove('fa-chevron-down');
        } else {
            rulesArrow.classList.add('fa-chevron-down');
            rulesArrow.classList.remove('fa-chevron-up');
        }
    });

    // Handle emoji buttons
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    emojiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const emoji = this.getAttribute('data-emoji');
            const chatInput = document.getElementById('chatInput');
            chatInput.value += emoji;
            chatInput.focus();
        });
    });

    // Toggle emoji panel
    const emojiToggle = document.querySelector('.emoji-toggle');
    const emojiPanel = document.querySelector('.emoji-panel');
    
    if (emojiToggle && emojiPanel) {
        emojiToggle.addEventListener('click', function() {
            emojiPanel.classList.toggle('active');
        });
    }

    // Chat input event listener for Enter key
    document.getElementById('chatInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendChat();
            // Hide emoji panel when sending
            const emojiPanel = document.querySelector('.emoji-panel');
            if (emojiPanel) {
                emojiPanel.classList.remove('active');
            }
        }
    });

    // Send button event listener
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChat);
    }

    // Hide emoji panel when clicking outside
    document.addEventListener('click', function(event) {
        const emojiPanel = document.querySelector('.emoji-panel');
        const emojiToggle = document.querySelector('.emoji-toggle');
        
        if (emojiPanel && emojiToggle) {
            if (emojiPanel.classList.contains('active') && !emojiPanel.contains(event.target) && !emojiToggle.contains(event.target)) {
                emojiPanel.classList.remove('active');
            }
        }
    });
});