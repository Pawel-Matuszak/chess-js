import Piece from "./Piece";

class Knight extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.value = 3;
  }

  getLegalMoves(board){
    let legalMoves = [];
    
    //save all posible legal moves
    if(board.board[this.pos.y+2]){
      legalMoves.push({x: this.pos.x-1, y: this.pos.y+2})
      legalMoves.push({x: this.pos.x+1, y: this.pos.y+2})
    }

    if(board.board[this.pos.y-2]){
      legalMoves.push({x: this.pos.x-1, y: this.pos.y-2})
      legalMoves.push({x: this.pos.x+1, y: this.pos.y-2})
    }

    if(board.board[this.pos.y+1]){
      legalMoves.push({x: this.pos.x+2, y: this.pos.y+1})
      legalMoves.push({x: this.pos.x-2, y: this.pos.y+1})
    }

    if(board.board[this.pos.y-1]){
      legalMoves.push({x: this.pos.x+2, y: this.pos.y-1})
      legalMoves.push({x: this.pos.x-2, y: this.pos.y-1})
    }

    //filter illegal moves
    legalMoves = legalMoves
    .filter(e=>{
      if(board.board[e.y, e.x]){
        return e;
      }
    })
    //check for enemy pieces
    .map(({x,y})=>{
      let isEmpty = (board.board[y][x]!=="-" && board.board[y][x].isWhite!==this.isWhite) ? false : true;
      let isAlly = (board.board[y][x].isWhite==this.isWhite) ? true : false;
      return {x,y, isEmpty, isAlly}
    })

    return legalMoves;
  }
}

export default Knight;