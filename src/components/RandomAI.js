class MoveGenerator{
  constructor(isWhite, gameController){
    this.isWhite = isWhite;
    this.gameController = gameController
  }

  playRandomMove(board){
    if(this.gameController.currentGameStatus !== this.gameController.gameStatus.active) return false;
    let all = board.getAllPieces();
    if(this.isWhite && this.gameController.whiteToMove){
      let randomPiece = Math.floor(Math.random() * (all.white.length));
      let movesArr = all.white[randomPiece].getLegalMoves(board).filter(({x,y,isEmpty,isAlly})=>!(isEmpty==false && isAlly==true))
      if(all.white[randomPiece].type.toLowerCase()=="p"){
        console.log(movesArr);
        movesArr = movesArr.filter(e=>e.x==all.white[randomPiece].pos.x || (e.isEmpty==false && e.isAlly==false));
      }
      if(movesArr.length<=0){
        this.playRandomMove(board);
      }else{
        let randomMove = movesArr[Math.floor(Math.random() * (movesArr.length))];
        
        //if a move was made
        if(all.white[randomPiece].move(randomMove.x, randomMove.y, board)){
          this.gameController.whiteToMove = false;
        }
      }

    }else{
      let randomPiece = Math.floor(Math.random() * (all.black.length));
      let movesArr = all.black[randomPiece].getLegalMoves(board).filter(({x,y,isEmpty,isAlly})=>!(isEmpty==false && isAlly==true));
      if(all.black[randomPiece].type.toLowerCase()=="p"){
        movesArr = movesArr.filter(e=>e.x==all.black[randomPiece].pos.x || (e.isEmpty==false && e.isAlly==false));
      }
      if(movesArr.length<=0){
        this.playRandomMove(board);
      }else{
        let randomMove = movesArr[Math.floor(Math.random() * (movesArr.length))];
        
        //if a move was made
        if(all.black[randomPiece].move(randomMove.x, randomMove.y, board)){
          this.gameController.whiteToMove = true;
        }
      }
    }
  }
}

export default MoveGenerator;