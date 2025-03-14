
      // Mobile-specific elements
      const mobileRulesBtn = document.getElementById('mobileRulesBtn');
      const mobilePlayersBtn = document.getElementById('mobilePlayersBtn');
      const mobileChatBtn = document.getElementById('mobileChatBtn');
      const mobileSettingsBtn = document.getElementById('mobileSettingsBtn');
      
      const playersPanel = document.getElementById('playersPanel');
      const chatPanel = document.getElementById('chatPanel');
      const settingsPanel = document.getElementById('settingsPanel');
      const infoSection = document.querySelector('.info-section');
      
      const closePlayersPanel = document.getElementById('closePlayersPanel');
      const closeChatPanel = document.getElementById('closeChatPanel');
      const closeSettingsPanel = document.getElementById('closeSettingsPanel');
      const closeInfoPanel = document.getElementById('closeInfoPanel');
      
      const rulesToggle = document.getElementById('rulesToggle');
      const rulesContent = document.getElementById('rulesContent');
      
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
      const emojiButtonas = document.querySelectorAll('.emoji-btn');
      
      // Function to close all panels
      function closeAllPanels() {
          playersPanel.classList.remove('active');
          chatPanel.classList.remove('active');
          settingsPanel.classList.remove('active');
          infoSection.classList.remove('active');
      }
      
      // Check if device is mobile (viewport width <= 768px)
      function isMobile() {
          return window.innerWidth <= 768;
      }
      
      // Button event listeners
      mobileRulesBtn.addEventListener('click', function() {
          rulesContent.classList.toggle('active');
          
          // Update the arrow icon
          const arrow = rulesToggle.querySelector('.rules-arrow');
          if (rulesContent.classList.contains('active')) {
              arrow.classList.remove('fa-chevron-down');
              arrow.classList.add('fa-chevron-up');
          } else {
              arrow.classList.remove('fa-chevron-up');
              arrow.classList.add('fa-chevron-down');
          }
      });
      
      rulesToggle.addEventListener('click', function() {
          rulesContent.classList.toggle('active');
          
          // Update the arrow icon
          const arrow = rulesToggle.querySelector('.rules-arrow');
          if (rulesContent.classList.contains('active')) {
              arrow.classList.remove('fa-chevron-down');
              arrow.classList.add('fa-chevron-up');
          } else {
              arrow.classList.remove('fa-chevron-up');
              arrow.classList.add('fa-chevron-down');
          }
      });
      
      mobilePlayersBtn.addEventListener('click', function() {
          closeAllPanels();
          playersPanel.classList.add('active');
          updateMobilePlayerLists();
      });
      
      mobileChatBtn.addEventListener('click', function() {
          closeAllPanels();
          chatPanel.classList.add('active');
          // Focus on chat input
          setTimeout(() => mobileChatInput.focus(), 300);
      });
      
      mobileSettingsBtn.addEventListener('click', function() {
          closeAllPanels();
          settingsPanel.classList.add('active');
      });
      
      // Close panel buttons
      closePlayersPanel.addEventListener('click', function() {
          playersPanel.classList.remove('active');
      });
      
      closeChatPanel.addEventListener('click', function() {
          chatPanel.classList.remove('active');
      });
      
      closeSettingsPanel.addEventListener('click', function() {
          settingsPanel.classList.remove('active');
      });
      
      closeInfoPanel.addEventListener('click', function() {
          infoSection.classList.remove('active');
      });
      
      // Touch outside to close panels (optional)
      document.addEventListener('click', function(event) {
          if (isMobile()) {
              if (
                  event.target.closest('.players-panel') === null && 
                  event.target.closest('#mobilePlayersBtn') === null &&
                  playersPanel.classList.contains('active')
              ) {
                  playersPanel.classList.remove('active');
              }
              
              if (
                  event.target.closest('.chat-panel') === null && 
                  event.target.closest('#mobileChatBtn') === null &&
                  chatPanel.classList.contains('active')
              ) {
                  chatPanel.classList.remove('active');
              }
              
              if (
                  event.target.closest('#settingsPanel') === null && 
                  event.target.closest('#mobileSettingsBtn') === null &&
                  settingsPanel.classList.contains('active')
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
              }
              
              if (spectatorList && mobileSpectatorList) {
                  mobileSpectatorList.innerHTML = spectatorList.innerHTML;
              }
          }
      }
      
      // Vibration feedback for mobile devices
      function vibrateIfEnabled(duration) {
          if (vibrationToggle.checked && navigator.vibrate) {
              navigator.vibrate(duration);
          }
      }
      
      // Handle mobile chat
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
      
      // Emoji buttons
      emojiButtonas.forEach(button => {
          button.addEventListener('click', function() {
              const emoji = this.getAttribute('data-emoji');
              mobileChatInput.value += emoji;
              mobileChatInput.focus();
              vibrateIfEnabled(20);
          });
      });
      
      // Theme change
      themeSelect.addEventListener('change', function() {
          const selectedTheme = this.value;
          document.body.className = ''; // Remove existing themes
          document.body.classList.add(`theme-${selectedTheme}`);
          
          // Store preference in localStorage
          localStorage.setItem('uttt-theme', selectedTheme);
      });
      
      // Leave game button
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
      
      // Sound toggle
      soundToggle.addEventListener('change', function() {
          const soundEnabled = this.checked;
          // Store preference in localStorage
          localStorage.setItem('uttt-sound', soundEnabled ? 'on' : 'off');
      });
      
      // Vibration toggle
      vibrationToggle.addEventListener('change', function() {
          const vibrationEnabled = this.checked;
          // Store preference in localStorage
          localStorage.setItem('uttt-vibration', vibrationEnabled ? 'on' : 'off');
      });
      
      // Mobile game status updates (to be called from main game logic)
      window.showMobileGameStatus = function(message, type) {
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
      };
      
      // Board overlay control (to be called from main game logic)
      window.toggleBoardOverlay = function(show, message) {
          if (show) {
              boardOverlay.classList.add('active');
              if (message) {
                  const content = boardOverlay.querySelector('.board-overlay-content p');
                  if (content) content.textContent = message;
              }
          } else {
              boardOverlay.classList.remove('active');
          }
      };
      
      // Function to update mobile chat (to be called from main chat logic)
      window.updateMobileChat = function(sender, message, type) {
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
      };
      
      // Load saved preferences
      function loadSavedPreferences() {
          // Theme
          const savedTheme = localStorage.getItem('uttt-theme') || 'default';
          themeSelect.value = savedTheme;
          document.body.classList.add(`theme-${savedTheme}`);
          
          // Sound
          const savedSound = localStorage.getItem('uttt-sound') || 'on';
          soundToggle.checked = savedSound === 'on';
          
          // Vibration - default to on for mobile, off otherwise
          const defaultVibration = isMobile() ? 'on' : 'off';
          const savedVibration = localStorage.getItem('uttt-vibration') || defaultVibration;
          vibrationToggle.checked = savedVibration === 'on';
      }
      
      // Resize handler
      function handleResize() {
          if (isMobile()) {
              // If switched to mobile view, make sure panels are closed
              closeAllPanels();
          } else {
              // If switched to desktop view, ensure mobile-specific elements are reset
              playersPanel.classList.remove('active');
              chatPanel.classList.remove('active');
              settingsPanel.classList.remove('active');
              mobileGameStatus.classList.remove('active');
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
      loadSavedPreferences();
      handleResize();
      
      // Expose functions that need to be called from main app.js
      window.mobileUtils = {
          updatePlayerLists: updateMobilePlayerLists,
          vibrate: vibrateIfEnabled,
          isMobileView: isMobile
      };