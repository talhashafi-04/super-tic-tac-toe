// Mobile-specific elements
const mobileRulesBtn = document.getElementById('mobileRulesBtn');
const mobilePlayersBtn = document.getElementById('mobilePlayersBtn');
const mobileChatBtn = document.getElementById('mobileChatBtn');
const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');

// Panels
const playersPanel = document.getElementById('playersPanel');
const chatPanel = document.getElementById('chatPanel');
const settingsPanel = document.getElementById('settingsPanel');
const infoSection = document.querySelector('.info-section');

// Close buttons
const closePlayersPanel = document.getElementById('closePlayersPanel');
const closeChatPanel = document.getElementById('closeChatPanel');
const closeSettingsPanel = document.getElementById('closeSettingsPanel');
const closeInfoPanel = document.getElementById('closeInfoPanel');
const rulesPanel = document.getElementById('rulesPanel');

const rulesToggle = document.querySelector('.rules-toggle');
const rulesContent = document.querySelector('.rules-content');

const mobileGameStatus = document.getElementById('mobileGameStatus');
const boardOverlay = document.getElementById('boardOverlay');

const leaveGameBtn = document.getElementById('leaveGameBtn');

// Mobile settings
const soundToggle = document.getElementById('soundToggle');
const vibrationToggle = document.getElementById('vibrationToggle');
const themeSelect = document.getElementById('themeSelect');

// Mobile chat elements
const mobileChatBox = document.getElementById('mobileChatBox');
const mobileChatInput = document.getElementById('mobileChatInput');
const mobileSendBtn = document.getElementById('mobileSendBtn');
const emojiButtons = document.querySelectorAll('.emoji-btn');

// Function to close all panels
function closeAllPanels() {
    if(playersPanel) playersPanel.classList.remove('active');
    if(chatPanel) chatPanel.classList.remove('active');
    if(settingsPanel) settingsPanel.classList.remove('active');
    if(infoSection) infoSection.classList.remove('active');
    if(rulesPanel) rulesPanel.classList.remove('active');
}


function checkIfMobile() {
    // Common breakpoint for mobile devices (768px)
    const mobileBreakpoint = 768;
    
    // Get the current window width
    const windowWidth = window.innerWidth;
    
    // Get the element by ID
    const info1 = document.getElementById("info1");
    const info2 = document.getElementById("info2");
    const rulesPanel = document.getElementById("rulesPanel");
    const playersPanel = document.getElementById("playersPanel");
    const chatPanel = document.getElementById("chatPanel");
    const roomPanel = document.getElementById("roomPanel"); 
    // Check if screen width is less than or equal to mobile breakpoint
    if (windowWidth <= mobileBreakpoint) 
    {
        info1.className = "";
        info2.className = "";

        roomPanel.className = "room-card";
        roomPanel.innerHTML = `<div class="room-info">
                          <i class="fas fa-hashtag pulse-icon"></i>
                          <span id="roomCodeDisplay" class="room-code">Loading room...</span>
                          <span class="tooltip">Click to copy</span>
                      </div>`;
        rulesPanel.className= "players-panel";
        playersPanel.className = "chat-panel";
        chatPanel.className = "chat-panel";
    } else 
    {
        info1.className = "info-section";
        info2.className = "info-section";

        roomPanel.className = "room-card glass-card";
        rulesPanel.className=("player-card glass-card");
        playersPanel.className=("");
        chatPanel.className=("chat-card glass-card");
    }
}

window.addEventListener("load", checkIfMobile);
window.addEventListener("resize", checkIfMobile);




// Check if device is mobile (viewport width <= 768px)
function isMobile() {
    return window.innerWidth <= 768;
}

// Button event listeners
if(mobileRulesBtn) {
    mobileRulesBtn.addEventListener('click', function() {
        closeAllPanels();
        if(rulesPanel) {
            // rulesContent.classList.add('active');
            rulesPanel.classList.add('active');
            
        }
    });
}

// if(rulesToggle) {
//     rulesToggle.addEventListener('click', function() {
//         if(rulesContent) {
//             rulesContent.classList.toggle('active');
            
//             // Update the arrow icon
//             const arrow = rulesToggle.querySelector('.rules-arrow');
//             if (arrow) {
//                 if (rulesContent.classList.contains('active')) {
//                     arrow.classList.remove('fa-chevron-down');
//                     arrow.classList.add('fa-chevron-up');
//                 } else {
//                     arrow.classList.remove('fa-chevron-up');
//                     arrow.classList.add('fa-chevron-down');
//                 }
//             }
//         }
//     });
// }

if(mobilePlayersBtn && playersPanel) {
    mobilePlayersBtn.addEventListener('click', function() {
        closeAllPanels();
        playersPanel.classList.add('active');
        updateMobilePlayerLists();
    });
}

if(mobileChatBtn && chatPanel) {
    mobileChatBtn.addEventListener('click', function() {
        closeAllPanels();
        chatPanel.classList.add('active');
        // Focus on chat input
        if(mobileChatInput) setTimeout(() => mobileChatInput.focus(), 300);
    });
}

if(mobileSettingsBtn && settingsPanel) {
    mobileSettingsBtn.addEventListener('click', function() {
        closeAllPanels();
        settingsPanel.classList.add('active');
    });
}

// Close panel buttons
if(closePlayersPanel && playersPanel) {
    closePlayersPanel.addEventListener('click', function() {
        playersPanel.classList.remove('active');
    });
}

if(closeChatPanel && rulesPanel) {
    closeChatPanel.addEventListener('click', function() {
        rulesPanel.classList.remove('active');
    });
}

if(closePlayersPanel && playersPanel) {
    closePlayersPanel.addEventListener('click', function() {
        playersPanel.classList.remove('active');
    });
}

if(closeChatPanel && chatPanel) {
    closeChatPanel.addEventListener('click', function() {
        chatPanel.classList.remove('active');
    });
}

if(closeSettingsPanel && settingsPanel) {
    closeSettingsPanel.addEventListener('click', function() {
        settingsPanel.classList.remove('active');
    });
}

// if(closeInfoPanel && infoSection) {
//     closeInfoPanel.addEventListener('click', function() {
//         infoSection.classList.remove('active');
//     });
// }

// Touch outside to close panels (optional)
document.addEventListener('click', function(event) {
    if (isMobile()) {
        if (
            playersPanel && 
            playersPanel.classList.contains('active') &&
            event.target.closest('#playersPanel') === null && 
            event.target.closest('#mobilePlayersBtn') === null
        ) {
            playersPanel.classList.remove('active');
        }

        if (
            rulesPanel && 
            rulesPanel.classList.contains('active') &&
            event.target.closest('#ruluesPanel') === null && 
            event.target.closest('#mobileRulesBtn') === null
        ) {
            rulesPanel.classList.remove('active');
        }
        
        if (
            chatPanel &&
            chatPanel.classList.contains('active') &&
            event.target.closest('#chatPanel') === null && 
            event.target.closest('#mobileChatBtn') === null
        ) {
            chatPanel.classList.remove('active');
        }

        if (
            rulesPanel &&
            rulesPanel.classList.contains('active') &&
            event.target.closest('#chatPanel') === null && 
            event.target.closest('#mobileChatBtn') === null
        ) {
            chatPanel.classList.remove('active');
        }
        
        if (
            settingsPanel &&
            settingsPanel.classList.contains('active') &&
            event.target.closest('#settingsPanel') === null && 
            event.target.closest('#mobileSettingsBtn') === null
        ) {
            settingsPanel.classList.remove('active');
        }
    }
}, true);

// Sync player lists between desktop and mobile views
function updateMobilePlayerLists() {
    if (isMobile()) {
        const playerList = document.getElementById('playerList');
        const spectatorList = document.getElementById('spectatorList');
        const mobilePlayerList = document.getElementById('mobilePlayerList');
        const mobileSpectatorList = document.getElementById('mobileSpectatorList');
        
        if (playerList && mobilePlayerList) {
            mobilePlayerList.innerHTML = playerList.innerHTML;
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
        }
        
        if (spectatorList && mobileSpectatorList) {
            mobileSpectatorList.innerHTML = spectatorList.innerHTML;
        }
    }
}

// Vibration feedback for mobile devices
function vibrateIfEnabled(duration) {
    if (vibrationToggle && vibrationToggle.checked && navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// Handle mobile chat
if(mobileSendBtn && mobileChatInput) {
    mobileSendBtn.addEventListener('click', function() {
        if (mobileChatInput.value.trim() !== '') {
            // Assuming there's a sendChatMessage function in the main app.js
            if (typeof sendChatMessage === 'function') {
                sendChatMessage(mobileChatInput.value);
                mobileChatInput.value = '';
                vibrateIfEnabled(20);
            }
        }
    });
    
    mobileChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && mobileChatInput.value.trim() !== '') {
            // Assuming there's a sendChatMessage function in the main app.js
            if (typeof sendChatMessage === 'function') {
                sendChatMessage(mobileChatInput.value);
                mobileChatInput.value = '';
                vibrateIfEnabled(20);
            }
        }
    });
}

// Emoji buttons
if(emojiButtons.length > 0) {
    emojiButtons.forEach(button => {
        button.addEventListener('click', function() {
            if(mobileChatInput) {
                const emoji = this.getAttribute('data-emoji');
                mobileChatInput.value += emoji;
                mobileChatInput.focus();
                vibrateIfEnabled(20);
            }
        });
    });
}

// Theme change
if(themeSelect) {
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        document.body.className = ''; // Remove existing themes
        document.body.classList.add(`theme-${selectedTheme}`);
        
        // Store preference in localStorage
        localStorage.setItem('uttt-theme', selectedTheme);
    });
}

// Leave game button
if(leaveGameBtn) {
    leaveGameBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to leave the game?')) {
            // Assuming there's a leaveGame function in main app.js
            if (typeof leaveGame === 'function') {
                leaveGame();
            } else {
                window.location.href = '/'; // Fallback to homepage
            }
        }
    });
}

// Sound toggle
if(soundToggle) {
    soundToggle.addEventListener('change', function() {
        const soundEnabled = this.checked;
        // Store preference in localStorage
        localStorage.setItem('uttt-sound', soundEnabled ? 'on' : 'off');
    });
}

// Vibration toggle
if(vibrationToggle) {
    vibrationToggle.addEventListener('change', function() {
        const vibrationEnabled = this.checked;
        // Store preference in localStorage
        localStorage.setItem('uttt-vibration', vibrationEnabled ? 'on' : 'off');
    });
}

// Mobile game status updates (to be called from main game logic)
window.showMobileGameStatus = function(message, type) {
    if(mobileGameStatus) {
        mobileGameStatus.textContent = message;
        mobileGameStatus.className = 'mobile-game-status';
        
        if (type) {
            mobileGameStatus.classList.add(type);
        }
        
        mobileGameStatus.classList.add('active');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            mobileGameStatus.classList.remove('active');
        }, 3000);
    }
};

// Board overlay control (to be called from main game logic)
window.toggleBoardOverlay = function(show, message) {
    if(boardOverlay) {
        if (show) {
            boardOverlay.classList.add('active');
            if (message) {
                const content = boardOverlay.querySelector('.board-overlay-content p');
                if (content) content.textContent = message;
            }
        } else {
            boardOverlay.classList.remove('active');
        }
    }
};

// Function to update mobile chat (to be called from main chat logic)
window.updateMobileChat = function(sender, message, type) {
    if(mobileChatBox) {
        const chatMessageDiv = document.createElement('div');
        chatMessageDiv.className = `chat-message ${type || ''}`;
        
        const senderDiv = document.createElement('div');
        senderDiv.className = 'sender';
        senderDiv.textContent = sender;
        
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        
        chatMessageDiv.appendChild(senderDiv);
        chatMessageDiv.appendChild(messageDiv);
        
        mobileChatBox.appendChild(chatMessageDiv);
        mobileChatBox.scrollTop = mobileChatBox.scrollHeight;
    }
};

// Load saved preferences
function loadSavedPreferences() {
    // Theme
    const savedTheme = localStorage.getItem('uttt-theme') || 'default';
    if(themeSelect) themeSelect.value = savedTheme;
    document.body.classList.add(`theme-${savedTheme}`);
    
    // Sound
    const savedSound = localStorage.getItem('uttt-sound') || 'on';
    if(soundToggle) soundToggle.checked = savedSound === 'on';
    
    // Vibration - default to on for mobile, off otherwise
    const defaultVibration = isMobile() ? 'on' : 'off';
    const savedVibration = localStorage.getItem('uttt-vibration') || defaultVibration;
    if(vibrationToggle) vibrationToggle.checked = savedVibration === 'on';
}

// Resize handler
function handleResize() {
    if (isMobile()) {
        // If switched to mobile view, make sure panels are closed
        closeAllPanels();
    } else {
        // If switched to desktop view, ensure mobile-specific elements are reset
        if(playersPanel) playersPanel.classList.remove('active');
        if(chatPanel) chatPanel.classList.remove('active');
        if(settingsPanel) settingsPanel.classList.remove('active');
        if(mobileGameStatus) mobileGameStatus.classList.remove('active');
    }
}

// Handle orientation change (specifically for mobile)
window.addEventListener('orientationchange', function() {
    // Close any open panels on orientation change
    setTimeout(() => {
        closeAllPanels();
    }, 100);
});

// Window resize listener
window.addEventListener('resize', handleResize);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSavedPreferences();
    handleResize();
});

// Expose functions that need to be called from main app.js
window.mobileUtils = {
    updatePlayerLists: updateMobilePlayerLists,
    vibrate: vibrateIfEnabled,
    isMobileView: isMobile
};