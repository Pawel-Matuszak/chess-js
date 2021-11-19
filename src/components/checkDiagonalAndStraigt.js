const checkDiagonalAndStraigt = (i=0, j=0, board, legalMovesArray, posX, posY, isWhite) =>{
  //when is out of border
  if(posY-(i)<0) return;
  if(posY-(i)>7) return;
  if(posX-(j)<0) return;
  if(posX-(j)>7) return;

  //when enemy piece is in the way
  if(board.board[posY-(i)][posX-(j)]!=="-"){
    if(board.board[posY-(i)][posX-(j)].type.toLowerCase()=='k'){
      let offsetX = (j==0) ? 0 : (j>0) ? 1 : -1;
      let offsetY = (i==0) ? 0 : (i>0) ? 1 : -1;
      legalMovesArray.push({
        x: posX-(j+(offsetX)),
        y: posY-(i+(offsetY)),
        isEmpty: true,
        isAlly: true
      })
    }
    legalMovesArray.push({
      x: posX-(j),
      y: posY-(i),
      isEmpty: false,
      isAlly: (board.board[posY-(i)][posX-(j)].isWhite==isWhite) ? true : false
    })
    return;
  }else{
    //add another avaliable square
    legalMovesArray.push({
      x: posX-(j),
      y: posY-(i),
      isEmpty: true,
    })

    //for diagonal
    if(i!==0 && j!==0){
      if(i>0 && j>0){
        checkDiagonalAndStraigt(i+1, j+1, board, legalMovesArray, posX, posY, isWhite);
      }else if(i<0 && j<0){
        checkDiagonalAndStraigt(i-1, j-1, board, legalMovesArray, posX, posY, isWhite);
      }else if(i>0 && j<0){
        checkDiagonalAndStraigt(i+1, j-1, board, legalMovesArray, posX, posY, isWhite);
      }else if(i<0 && j>0){
        checkDiagonalAndStraigt(i-1, j+1, board, legalMovesArray, posX, posY, isWhite);
      }

    //for straight lines
    }else if(i<0){
      checkDiagonalAndStraigt(i-1, 0, board, legalMovesArray, posX, posY, isWhite);
    }else if(i>0){
      checkDiagonalAndStraigt(i+1, 0, board, legalMovesArray, posX, posY, isWhite);
    }else if(j>0){
      checkDiagonalAndStraigt(0, j+1, board, legalMovesArray, posX, posY, isWhite);
    }else if(j<0){
      checkDiagonalAndStraigt(0, j-1, board, legalMovesArray, posX, posY, isWhite);
    }
  }
}

export default checkDiagonalAndStraigt