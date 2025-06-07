import Board from "./components/Board.js"
import GameController from "./components/GameController.js";
import UserInterface from "./components/UserInterface.js";
import "./style.css"

const userInterface = new UserInterface()
const gameController = new GameController(userInterface);
const board = new Board(gameController);
board.createBoard();
userInterface.init(board, gameController);
gameController.init("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", board);

window.addEventListener("contextmenu", (e) => e.preventDefault());