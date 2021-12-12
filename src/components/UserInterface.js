import { create, identity } from "lodash";

class UserInterface{
  constructor(){
    this.buttons = {};
    this.showCsB = false;
    this.showCsW = false;
    this.gameController = null;
    this.board = null;
    this.histPos = 0;
    this.movesList = document.createElement("div");
    this.currentMove = 0;
  }

  handlePrevious(movesHistory){
    let history = movesHistory;
    
    if(this.currentMove<=1) return;
    this.currentMove--
    this.board.removePieces();
    this.board.readFEN(history[this.currentMove-1].board)

    if(this.showCsW){
      board.getControlledSquares();
      board.showControlledSquares(true);
    }else if(this.showCsB){
      board.getControlledSquares();
      board.showControlledSquares(false);
    }

    this.updateCurrentMove()
    for (const e of document.querySelectorAll(".move-highlight")) {
      e.remove()
    }
  }

  handleNext(movesHistory){
    let history = movesHistory;
    
    if(this.currentMove>movesHistory.length-1) return;
    this.currentMove++
    this.board.removePieces();
    // if(this.histPos<0) this.histPos *=-1;
    this.board.readFEN(history[this.currentMove-1].board)
    
    if(this.showCsW){
      board.getControlledSquares();
      board.showControlledSquares(true);
    }else if(this.showCsB){
      board.getControlledSquares();
      board.showControlledSquares(false);
    }
    
    this.updateCurrentMove()
    for (const e of document.querySelectorAll(".move-highlight")) {
      e.remove()
    }
  }

  init(board, gameController){
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class", "wrapper");
    this.buttonWrapper = document.createElement("div");
    this.buttonWrapper.setAttribute("class", "button-wrapper");
    this.board = board;
    this.gameController = gameController;
    this.currentMove = gameController.halfmoveCount;
    //create buttons for hilighting squares controlled by each color
    this.buttons["toggleWhiteCS"] = document.createElement("button");
    this.buttons["toggleWhiteCS"].innerText = "White threat map";
    this.buttons["toggleBlackCS"] = document.createElement("button");
    this.buttons["toggleBlackCS"].innerText = "Black threat map";
    this.buttons["previous"] = document.createElement("button");
    this.buttons["previous"].innerText = "Previous move";
    this.buttons["previous"].setAttribute("class", "history-btn");
    this.buttons["next"] = document.createElement("button");
    this.buttons["next"].innerText = "Next move";
    this.buttons["next"].setAttribute("class", "history-btn");
    this.movesList.setAttribute("class", "moves-list");
    this.movesList.innerHTML = "<div class='move-list-header'> Normlanie lista ruchów tu będzie</div>";

    this.buttons["toggleWhiteCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsW = !this.showCsW;
      this.showCsB = false;
      if(this.showCsW){
        board.getControlledSquares();
        board.showControlledSquares(true);
      }
    })


    this.buttons["toggleBlackCS"].addEventListener("click", ()=>{
      board.removeControlledSquares();
      this.showCsB = !this.showCsB;
      this.showCsW = false;
      if(this.showCsB){
        board.getControlledSquares();
        board.showControlledSquares(false);
      }
    })

    this.buttons["previous"].addEventListener("click", ()=>{
      this.handlePrevious(this.gameController.movesHistory)
    });

    this.buttons["next"].addEventListener("click", ()=>{
      this.handleNext(this.gameController.movesHistory)
    });

    for (const btn of Object.keys(this.buttons)) {
      this.buttonWrapper.append(this.buttons[btn])
    }
    this.wrapper.append(this.buttonWrapper, this.movesList);
    document.body.appendChild(this.wrapper);

    
  }

  updateMoves(movesHistory, board){
    this.movesList.innerHTML = "<div class='move-list-header'> Normlanie lista ruchów tu będzie</div>";
    
    let i=0;
    movesHistory.forEach((move) => {
      let divMove = document.createElement("div");
      divMove.setAttribute("class", "move");
      this.movesList.appendChild(divMove);

      divMove.addEventListener("click", ()=>{
        this.board.removePieces();
        this.board.readFEN(move.board);
        this.currentMove = Array.prototype.indexOf.call(divMove.parentNode.children, divMove);
        this.updateCurrentMove()
      })
      divMove.innerHTML = move.move;
      i++;
    });
  }
  
  updateCurrentMove(){
    console.log(this.currentMove);
    this.movesList.childNodes.forEach(child=>{
      child.style.color = "#fff"
    })
    this.movesList.childNodes[this.currentMove].style.color = "#a5a"
  }
}

export default UserInterface;