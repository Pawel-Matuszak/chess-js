import Board from "./components/Board.js"
import GameController from "./components/GameController.js";
import "./style.css"

const gameController = new GameController();
gameController.init();
const board = new Board(gameController);
board.createBoard();
// board.readFEN("7k/3r4/8/8/8/8/8/R3K2R")
// board.readFEN("8/R2r3k/8/8/8/8/8/4K1R1")
// board.readFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")

//opening
// board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
// board.readFEN("3qkb1r/ppppp2p/8/8/8/4P3/8/RNBQKBNR w KQkq e3 0 1")


//real legal moves that can be made
// let all = board.getAllPieces();
// console.log(all.black[1].getLegalMoves(board).filter(({x,y,isEmpty,isAlly})=>!(isEmpty==false && isAlly==true)));
// all.black[1].move(2, 2, board)

//test queen checks
// board.readFEN("rnbqkbnr/pp2pppp/3p4/2p5/2PPP3/5N2/PP3PPP/RNBQKB1R")


//TODO

//saving previous moves
