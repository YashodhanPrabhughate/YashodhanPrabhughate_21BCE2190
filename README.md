# Turn-based Chess-like Game with WebSocket Communication

## Overview

This project is a turn-based chess-like game developed with a server-client architecture. The game features a 5x5 grid where two players control teams of characters (Pawns, Hero1, and Hero2) and take turns to move them strategically. The game logic is implemented on the server side, with real-time communication handled via WebSockets, and the user interface is a web-based client.

## Features

- **5x5 Grid Board**: The game is played on a 5x5 grid.
- **Characters**: Each player has 5 characters, including Pawns, Hero1, and Hero2.
- **Real-time Communication**: The game uses WebSockets for real-time interaction between the server and clients.
- **Game State Management**: The server maintains and updates the game state, handling moves and win conditions.
- **Move History**: The game displays a history of moves for players to review.

## Technologies Used

- **Server-side**: Node.js, WebSocket
- **Client-side**: HTML, CSS, JavaScript

## Game Rules

- **Movement**:
  - **Pawn**: Moves one block in any direction (Left, Right, Forward, Backward).
  - **Hero1**: Moves two blocks straight in any direction and can eliminate opponents in its path.
  - **Hero2**: Moves two blocks diagonally in any direction and can eliminate opponents in its path.
- **Win Condition**: The game ends when one player eliminates all of their opponent's characters.

## Setup and Installation

### Prerequisites

- Node.js installed on your system.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YashodhanPrabhughate/YashodhanPrabhughate_21BCE2190.git
   cd YashodhanPrabhughate_21BCE2190
   ```

2. **Install Dependencies**:
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Start the Server**:
   Start the WebSocket server by running:
   ```bash
   node server.js
   ```

4. **Open the Client**:
   Open `index.html` in a web browser to start the game.

## How to Play

1. **Initial Setup**: Each player arranges their characters on their respective starting rows.
2. **Turns**: Players alternate turns. During a turn, a player selects one of their characters and makes a move.
3. **Moves**: Valid moves will be highlighted when a character is selected.
4. **Winning the Game**: The game continues until one player eliminates all of their opponent's characters.

## Project Structure

- `server.js`: Contains the server-side code with the game logic and WebSocket communication.
- `index.html`: The client-side interface.
- `client.js`: JavaScript file handling client-side logic, including WebSocket communication and UI interactions.
- `styles.css`: Optional CSS file for styling the game board and interface.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contributing

Feel free to contribute to this project by forking the repository and submitting a pull request.


---

