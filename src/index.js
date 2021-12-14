import Board from "./components/Board.js"
import GameController from "./components/GameController.js";
import MoveGenerator from "./components/MoveGenerator.js";
import UserInterface from "./components/UserInterface.js";
import "./style.css"

const userInterface = new UserInterface()
const gameController = new GameController(userInterface);
const board = new Board(gameController);
board.createBoard();
userInterface.init(board, gameController);
// board.readFEN("7k/3r4/8/8/8/8/8/R3K2R")
// board.readFEN("8/R2r3k/2p5/1P1P4/8/8/8/4K1R1 w KQkq - 0 1")
// board.readFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")
gameController.init("r3k2r/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", board);

//opening
// board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
// board.readFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

const moveGeneratorW = new MoveGenerator(true, gameController)
const moveGeneratorB = new MoveGenerator(false, gameController)

function play(){
  setInterval( () => {
    let start = Date.now();
    moveGeneratorW.playRandomMove(board, gameController);
    setTimeout(() => {
      moveGeneratorB.playRandomMove(board, gameController);
    }, 100);
    // console.log(Date.now()-start + "ms")
    
  }, 200);
  
}

// play()


//TODO

//pawn.js 39: t][board.gameController.enPassantTargetSquare.x]

//user interface visuals
//draw by repetition

