import Piece from "./Piece";
import Queen from "./Queen";

class Pawn extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.value = 1;
  }

  //return all moves
  getLegalMoves(board){
    let allMoves = [];
    let offset = (this.isWhite) ? 1 : -1;

    //piece promotion
    if((this.isWhite && this.pos.y==0) || (!this.isWhite && this.pos.y==7)){
      //new Piece(this.pos.x, this.pos.y ...)
      let type = (this.isWhite) ? "Q" : "q";
      let newPiece = new Queen(type, this.pos.x, this.pos.y, this.isWhite);
      newPiece.createPiece(board);
      if(this.pieceDiv){
        this.pieceDiv.remove()
      }
      return allMoves;
    }

    //captures
    let square = board.board[this.pos.y-offset][this.pos.x-1]
    if(square){
      //if en passant is avaliable
      if(board.gameController.enPassantTargetSquare && board.gameController.enPassantTargetSquare!=="-"){
        //if this piece can capture en passant
        let target = board.board[board.gameController.enPassantTargetSquare.y+offset][board.gameController.enPassantTargetSquare.x];
        if(target!=="-" && target.isWhite!==this.isWhite){
          if(board.gameController.enPassantTargetSquare.x === this.pos.x-1 && board.gameController.enPassantTargetSquare.y === this.pos.y-offset){
            allMoves.push({
              x: this.pos.x-1, 
              y: this.pos.y-offset, 
              isEmpty: true,
              isAlly: false,
              enPassant: true
            })
          }
        }
      }
      //else
      if(square!=="-"){
        allMoves.push({
          x: this.pos.x-1, 
          y: this.pos.y-offset, 
          isEmpty: false,
          isAlly: (square.isWhite==this.isWhite) ? true : false
        })
      }else{
        allMoves.push({
          x: this.pos.x-1, 
          y: this.pos.y-offset, 
          isEmpty: true,
          isAlly: true
        })
      }
    }
    square = board.board[this.pos.y-offset][this.pos.x+1]
    if(square){
      if(board.gameController.enPassantTargetSquare && board.gameController.enPassantTargetSquare!=="-"){
        //if this piece can capture en passant
        let target = board.board[board.gameController.enPassantTargetSquare.y+offset][board.gameController.enPassantTargetSquare.x];
        if(target!=="-" && target.isWhite!==this.isWhite){
          if(board.gameController.enPassantTargetSquare.x === this.pos.x+1 && board.gameController.enPassantTargetSquare.y === this.pos.y-offset){
            allMoves.push({
              x: this.pos.x+1, 
              y: this.pos.y-offset, 
              isEmpty: true,
              isAlly: false,
              enPassant: true
            })
          }
        }
      }
      if(square!=="-"){
        allMoves.push({
          x: this.pos.x+1, 
          y: this.pos.y-offset, 
          isEmpty: false,
          isAlly: (square.isWhite==this.isWhite) ? true : false
        })
      }else{
        allMoves.push({
          x: this.pos.x+1, 
          y: this.pos.y-offset, 
          isEmpty: true,
          isAlly: true
        })
      }

    }

    //EN PASANT
    //is possible when some enemy pawn is controlling board.enPassantTargetSquare

    //forward movement
    if(board.board[this.pos.y-offset][this.pos.x]=="-"){
      
      allMoves.push({
        x: this.pos.x, 
        y: this.pos.y-offset, 
        isEmpty: true
      })
      
      //when the first square is empty check if the the piece was moved before
      if(this.pos.y==6 && this.isWhite) offset = 2;
      if(this.pos.y==1 && !this.isWhite) offset = -2;
      
      //and if that square is empty
      if(board.board[this.pos.y-offset]){
        if(board.board[this.pos.y-offset][this.pos.x]=="-" && !this.wasMoved){
          allMoves.push({
            x: this.pos.x, 
            y: this.pos.y-offset, 
            isEmpty: true
          })
        }

      }
    }

    return allMoves;
  }
}

export default Pawn;