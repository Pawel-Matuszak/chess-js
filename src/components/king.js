import Piece from "./Piece";

class King extends Piece{
  constructor(type, posX, posY, isWhite){
    super(type, posX, posY, isWhite);
    this.inCheck = false;
  }

    //danger
    //save the squares attacked by enemy* pieces in the array**
    //*white if king is black and black if white
    //**like getLegalMoves
    //////////////////////////////////////////////
    //funciton calculateSquaresControlledByEnemy in Piece class returning array of [x,y] squares
    //here we have to check if the square king is trying to go is one of the returned by calculateSquaresControlledByEnemy
    //if true we return and draw board as it was;
    //////////////////////////////////////////////
    //king is forced to move if is in check
    //this.inCheck

  getLegalMoves(board){
    let legalMoves = []
    //save valid squares 
    //loop through the board
    for (let i = 0; i < board.board.length; i++) {
      for (let j = 0; j < board.board[i].length; j++) {
        //find the squares that the king could move to
        if((j<=this.pos.x+1 && j>=this.pos.x-1) &&
        (i>=this.pos.y-1 && i<=this.pos.y+1)){
          if(!(i==this.pos.y && j==this.pos.x)){
            //if the square is empty or if the piece on this square is opposite color
            //add sqare to legal squares
            if(board.board[i][j]==="-"){
              legalMoves.push({
                x: j, 
                y: i, 
                isEmpty: true,
                isAlly: undefined
              });
            }else{
              legalMoves.push({
                x: j, 
                y: i, 
                isEmpty: false,
                isAlly: (board.board[i][j].isWhite==this.isWhite) ? true : false
              });
            }
          }
        }
      }
    }
    
    let enemySquares = []
    if(this.isWhite){
      enemySquares = board.controlledSquares.black;
    }else{
      enemySquares = board.controlledSquares.white;
    }
    //calculate set difference
    legalMoves = legalMoves.filter(({ x: x1, y: y1 }) => !enemySquares.some(({ x: x2, y: y2}) => (x2 === x1 && y2 === y1)));

    return legalMoves;
  }

  //changes position on the screen
  move(posX, posY, board){
    this.legalMoves = this.getLegalMoves(board);
    
    //check if a move is legal
    this.legalMoves.forEach(({x,y,isEmpty, isAlly}) => {
      if(posX==x && posY==y){
        if(isAlly) return;
        this.gameController.makeMove(x,y,isEmpty,board,this);
      }
    });
    board.drawPieces();
  }
}

export default King;