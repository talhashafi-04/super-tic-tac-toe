from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List, Dict, Optional
from uuid import uuid4
import json

app = FastAPI()

# Static files and templates setup
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, "GameRoom"] = {}

    def create_or_get_room(self, room_code: str):
        if room_code not in self.rooms:
            self.rooms[room_code] = GameRoom(room_code)
        return self.rooms[room_code]


class Player:
    def __init__(self, name: str, ws: WebSocket):
        self.name = name
        self.ws = ws


class GameRoom:
    def __init__(self, code: str):
        self.code = code
        # 9 small boards, each with 9 cells
        self.local_boards = [None] * 81  # All cells of all small boards
        self.super_board = [None] * 9    # Status of each small board
        self.players: List[Player] = []
        self.spectators: List[Player] = []
        self.current_turn = 0            # 0 for player 1 (X), 1 for player 2 (O)
        self.next_board_index = -1       # -1 means player can choose any board
        self.game_state = "waiting"      # waiting, playing, win, draw
        self.winner = None

    def add_player(self, player: Player):
        if len(self.players) < 2:
            self.players.append(player)
            if len(self.players) == 2:
                self.game_state = "playing"
            return "player"
        else:
            self.spectators.append(player)
            return "spectator"

    def remove_player(self, player: Player):
        self.players = [p for p in self.players if p.name != player.name]
        self.spectators = [s for s in self.spectators if s.name != player.name]
        
        # If a player leaves and there's only one player left, reset to waiting state
        if len(self.players) < 2 and self.game_state == "playing":
            self.game_state = "waiting"

    def make_move(self, player: Player, index: int) -> bool:
        # Check if it's not this player's turn or game not in playing state
        if self.game_state != "playing" or self.players[self.current_turn].name != player.name:
            return False
            
        # Calculate which small board and which cell within that board
        board_index = index // 9
        cell_index = index % 9
        
        # Check if the move is valid based on next_board_index
        if self.next_board_index != -1 and self.next_board_index != board_index:
            return False
            
        # Check if the board is already won or cell is already occupied
        if self.super_board[board_index] is not None or self.local_boards[index] is not None:
            return False
            
        # Make the move
        self.local_boards[index] = "X" if self.current_turn == 0 else "O"
        
        # Check if this move won the small board
        self.check_small_board_win(board_index)
        
        # Determine next board to play on
        next_small_board = cell_index
        if self.super_board[next_small_board] is not None:
            # If the next board is already won or full, player can choose any board
            self.next_board_index = -1
        else:
            self.next_board_index = next_small_board
            
        # Check if this move won the game
        self.check_super_board_win()
        
        # Switch turns
        self.current_turn = 1 - self.current_turn
        
        return True

    def check_small_board_win(self, board_index: int) -> None:
        # If board already has a result, return
        if self.super_board[board_index] is not None:
            return
            
        # Get all cells for this small board
        start_index = board_index * 9
        cells = self.local_boards[start_index:start_index + 9]
        
        # Winning combinations
        win_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]              # Diagonals
        ]
        
        # Check for a win
        current_symbol = "X" if self.current_turn == 0 else "O"
        for combo in win_combinations:
            if cells[combo[0]] == cells[combo[1]] == cells[combo[2]] == current_symbol:
                self.super_board[board_index] = current_symbol
                return
                
        # Check if board is full (tie)
        if all(cell is not None for cell in cells):
            self.super_board[board_index] = "T"  # T for Tie

    def check_super_board_win(self) -> None:
        # Winning combinations
        win_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]              # Diagonals
        ]
        
        # Check for a win
        current_symbol = "X" if self.current_turn == 0 else "O"
        for combo in win_combinations:
            if (self.super_board[combo[0]] == self.super_board[combo[1]] == self.super_board[combo[2]] == current_symbol):
                self.game_state = "win"
                self.winner = current_symbol
                return
                
        # Check for a draw - all small boards have a result (won or tie)
        if all(status is not None for status in self.super_board):
            self.game_state = "draw"
            return

    def game_state_payload(self):
        return {
            "type": "state",
            "superBoard": self.super_board,
            "localBoards": self.local_boards,
            "players": [p.name for p in self.players],
            "spectators": [s.name for s in self.spectators],
            "currentPlayer": "X" if self.current_turn == 0 else "O",
            "nextBoardIndex": self.next_board_index,
            "gameState": self.game_state,
            "winner": self.winner
        }


manager = ConnectionManager()

@app.get("/", response_class=HTMLResponse)
async def root():
    with open("templates/index.html", "r") as f:
        return HTMLResponse(f.read())

@app.get("/game", response_class=HTMLResponse)
async def game():
    with open("templates/game.html", "r") as f:
        return HTMLResponse(f.read())
    
@app.get("/room", response_class=HTMLResponse)
async def room():
    with open("templates/room.html", "r") as f:
        return HTMLResponse(f.read())


@app.websocket("/ws/game")
async def game_websocket(ws: WebSocket, name: str, room: str = None):
    await ws.accept()
    room_code = room or str(uuid4())[:6]
    game_room = manager.create_or_get_room(room_code)

    player = Player(name=name, ws=ws)
    role = game_room.add_player(player)

    # Send the room code to the client
    await ws.send_json({
        "type": "roomInfo",
        "room": room_code
    })

    # Send current game state to the new player
    await ws.send_json(game_room.game_state_payload())

    # Broadcast to all other players that a new player has joined
    await broadcast_chat(game_room, "System", f"{name} has joined the game as a {role}.")

    try:
        while True:
            data = await ws.receive_text()
            message = json.loads(data)

            if message["type"] == "move":
                if role == "player" and game_room.game_state == "playing":
                    if game_room.make_move(player, message["index"]):
                        # Broadcast the new game state to all players
                        await broadcast_state(game_room)

            elif message["type"] == "chat":
                # Don't broadcast the message to the sender, as they've already added it locally
                await broadcast_chat(game_room, player.name, message["message"], exclude=player)

    except WebSocketDisconnect:
        game_room.remove_player(player)
        await broadcast_chat(game_room, "System", f"{name} has left the game.")
        
        # If the room is empty, delete it
        if not game_room.players and not game_room.spectators:
            del manager.rooms[room_code]
        else:
            # Otherwise, broadcast the updated state
            await broadcast_state(game_room)


async def broadcast_state(game_room: GameRoom):
    state = game_room.game_state_payload()
    await broadcast_to_all(game_room, state)


async def broadcast_chat(game_room: GameRoom, sender: str, message: str, exclude: Player = None):
    chat_message = {
        "type": "chat",
        "sender": sender,
        "message": message
    }
    await broadcast_to_all(game_room, chat_message, exclude)


async def broadcast_to_all(game_room: GameRoom, message: dict, exclude: Player = None):
    disconnected = []
    
    for player in game_room.players + game_room.spectators:
        if exclude and player.name == exclude.name:
            continue
            
        try:
            await player.ws.send_json(message)
        except Exception:
            disconnected.append(player)

    # Clean up disconnected players
    for player in disconnected:
        game_room.remove_player(player)
        if message["type"] != "chat" or message["sender"] != "System":
            await broadcast_chat(game_room, "System", f"{player.name} disconnected.")