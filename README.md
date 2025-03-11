# 🕹️ Super Tic-Tac-Toe

Super Tic-Tac-Toe is an **online multiplayer game** built with **FastAPI** and **WebSockets**. Players can create rooms, invite friends, and play Ultimate Tic-Tac-Toe in real time.

## 🌟 Features
- 🎮 **Multiplayer Mode** – Play against friends in real-time.
- 💬 **Live Chat** – Send messages during the game.
- 👀 **Spectator Mode** – Watch ongoing games.
- 🔥 **Dynamic UI** – Responsive and animated board.
- 🏆 **Competitive Play** – Win by dominating the Super Board!

## 🚀 Live Demo
👉 **[Play Now](https://your-super-tic-tac-toe.onrender.com)** (Update with actual URL after deployment)

## 📂 Project Structure
```
/super-tic-tac-toe
│── /templates       # HTML templates
│   ├── index.html   # Landing page
│   ├── room.html    # Lobby page
│   ├── game.html    # Main game UI
│── /static          # Static files (CSS & JS)
│   ├── styles.css   # Styling
│   ├── script.js    # Game logic & WebSockets
│── app.py           # FastAPI backend
│── requirements.txt # Dependencies list
│── start.sh         # Render startup command
│── README.md        # Documentation
```

## 🛠️ Setup & Deployment
### 🔹 Local Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd super-tic-tac-toe
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the server:
   ```sh
   bash start.sh
   ```
4. Open **http://localhost:10000** in your browser.

### 🔹 Deploy on Render
1. Push code to **GitHub**
2. Connect **Render** to your GitHub repo
3. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `bash start.sh`
4. Deploy and get your live URL! 🌍

## 🏆 How to Play
- The board consists of **9 smaller Tic-Tac-Toe boards** arranged in a 3×3 grid.
- Your move determines where your opponent plays next.
- Win **three small boards in a row** to win the game!

## 📜 License
This project is open-source under the **MIT License**.

---
🎉 Enjoy playing **Super Tic-Tac-Toe**! 🚀

