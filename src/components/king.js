import Piece from "./piece";

class King extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.wasMoved = false;
  }

  move(posX, posY, board){
    //move validation
    //range
    if(!((posX<=this.pos.x+1 && posX>=this.pos.x-1) &&
      (posY>=this.pos.y-1 && posY<=this.pos.y+1))){
        board.drawBoard()
        return;
    }
    //collisions
    if(!(board.board[posY][posX]==="-") && board.board[posY][posX].isWhite){
      // 
      board.drawBoard()
      return;
    }

    //danger

    board.board[this.pos.y][this.pos.x] = "-";
    this.pos = {
      x: (posX>7) ? 7 : (posX<0) ? 0 : posX,
      y: (posY>7) ? 7 : (posY<0) ? 0 : posY
    }
    board.board[this.pos.y][this.pos.x] = this;
    this.wasMoved = true;
    
    board.drawBoard();
    this.getLegalMoves(board);
    // console.log(board.board);
  }

  getLegalMoves(board){
    //save valid squares 
    this.legalMoves = [];
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        if((j<=this.pos.x+1 && j>=this.pos.x-1) &&
        (i>=this.pos.y-1 && i<=this.pos.y+1)){
          if(!(i==this.pos.y && j==this.pos.x)){
            if(board.board[i][j]==="-" || !board.board[i][j].isWhite){
              let isPiece = (board.board[i][j].isWhite==false) ? true : false;
              this.legalMoves.push([j,i, isPiece]);
            }
          }
        }
      }
    }
    this.showLegalMoves(board.boardDiv);
  }
}

export default King;