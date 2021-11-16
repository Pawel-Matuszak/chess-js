import Board from "./Board";

class GameController{
  constructor(board){
    this.boardRef = board;
    this.inCheck = {
      white: false,
      black: false,
    }
    //check if check after making attempt to move*
    // *changing turn from one color to other
  }

  makeMove(x,y, isEmpty, board, piece){
    // check if move is a capture
    if(!isEmpty){
      board.board[y][x].die();
      board.drawPieces();
    }
    board.board[piece.pos.y][piece.pos.x] = "-";
    piece.pos = {
      x: (x>7) ? 7 : (x<0) ? 0 : x,
      y: (y>7) ? 7 : (y<0) ? 0 : y
    }
    board.board[piece.pos.y][piece.pos.x] = piece;
    piece.wasMoved = true;
    
    board.drawPieces();
    piece.showLegalMoves(board);
  }
}

export default GameController