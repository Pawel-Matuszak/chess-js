import Bishop from "./Bishop";
import Board from "./Board";
import King from "./King";
import Knight from "./Knight";
import Pawn from "./Pawn";
import Piece from "./Piece";
import Queen from "./Queen";
import Rook from "./Rook";

class GameController{
  constructor(board){
    this.boardRef = board;
    this.inCheck = {
      white: false,
      black: false,
    }
    this.king = {
      white: undefined,
      black: undefined
    }
    //TODO
    //define when king is in check
      //if one of the controlled squares (of white) has the same coordinates as the king (black)
      //then black is in check
      //* need to find a king in this.boardRef
      //* or use king class
    
    // *changing turn from one color to other
    
    //clear move hilights
    window.addEventListener('click', function(e){   
      console.log("a");
      for (const e of document.querySelectorAll(".point")) {
        e.remove()
      }
    });
  }

  findKings(board){
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if(board.board[j][i].type==="k"){
          this.king.black = board.board[j][i];
        }else if(board.board[j][i].type==="K"){
          this.king.white = board.board[j][i];
        }
      }
    }
  }

  moveValidation(x,y, isEmpty, board, piece){
    if(this.seeIfCheck(x,y, isEmpty, board, piece)) return;
    
    // check if move is a capture
    this.makeMove(x,y, isEmpty, board, piece);
    board.drawPieces();
    piece.showLegalMoves(board);
  }

  makeMove(x,y, isEmpty, board, piece){
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
  }

  seeIfCheck(x,y, isEmpty, board, piece){
    //pls don't look its probably not even working
    this.findKings(board);
    this.inCheck.white = false;
    this.inCheck.black = false;
    board.controlledSquares.black.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.white.pos.x && sY==this.king.white.pos.y){
        this.inCheck.white = true;
      }
    });
    board.controlledSquares.white.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.black.pos.x && sY==this.king.black.pos.y){
        this.inCheck.black = true;
      }
    });

    this.temp = new Board(this)
    this.temp.board = [[],[],[],[],[],[],[],[]]
    this.temp.boardDiv = board.boardDiv

    if(piece.type.toLowerCase()=="k"){
      this.tempPiece = new King(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="p"){
      this.tempPiece = new Pawn(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="n"){
      this.tempPiece = new Knight(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="r"){
      this.tempPiece = new Rook(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="b"){
      this.tempPiece = new Bishop(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else if(piece.type.toLowerCase()=="q"){
      this.tempPiece = new Queen(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }else{
      this.tempPiece = new Piece(piece.type, piece.pos.x, piece.pos.y, piece.isWhite);
    }

    //create this.temp board
    //dont know why I have to do this
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if(board.board[i][j]=="-"){
          this.temp.board[i][j]="-"
        }else{
          if(board.board[i][j].type.toLowerCase()=="k"){
            this.temp.board[i][j] = new King(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="p"){
            this.temp.board[i][j] = new Pawn(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="n"){
            this.temp.board[i][j] = new Knight(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="r"){
            this.temp.board[i][j] = new Rook(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="b"){
            this.temp.board[i][j] = new Bishop(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else if(board.board[i][j].type.toLowerCase()=="q"){
            this.temp.board[i][j] = new Queen(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }else{
            this.temp.board[i][j] = new Piece(board.board[i][j].type, j, i, (board.board[i][j].type.toLowerCase()==board.board[i][j].type) ? false : true);
          }
        }
      }
    }

    //change piece pos on a this.temp board
    if(!isEmpty){
      this.temp.board[y][x].die();
    }
    this.temp.board[this.tempPiece.pos.y][this.tempPiece.pos.x] = "-";
    this.tempPiece.pos = {
      x: (x>7) ? 7 : (x<0) ? 0 : x,
      y: (y>7) ? 7 : (y<0) ? 0 : y
    }
    this.temp.board[this.tempPiece.pos.y][this.tempPiece.pos.x] = this.tempPiece;

    this.temp.getControlledSquares();
    this.inCheck.white = false;
    this.inCheck.black = false;
    
    this.findKings(this.temp);
    this.temp.controlledSquares.black.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.white.pos.x && sY==this.king.white.pos.y){
        this.inCheck.white = true;
      }
    });
    this.temp.controlledSquares.white.forEach(({x: sX, y: sY}) => {
      if(sX==this.king.black.pos.x && sY==this.king.black.pos.y){
        this.inCheck.black = true;
      }
    });
    // this.temp.showControlledSquares()

    if((this.inCheck.white && piece.isWhite) || (this.inCheck.black && !piece.isWhite)){
    //when king is still in check
      board.drawPieces();
      return true;
    }
  }
  
}

export default GameController