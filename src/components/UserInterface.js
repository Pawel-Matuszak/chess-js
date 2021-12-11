import { identity } from "lodash";

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

  init(board, gameController){
    this.board = board;
    this.gameController = gameController;
    this.currentMove = gameController.halfmoveCount;
    //create buttons for hilighting squares controlled by each color
    this.buttons["toggleWhiteCS"] = document.createElement("button");
    this.buttons["toggleWhiteCS"].innerText = "White controlled squares";
    this.buttons["toggleBlackCS"] = document.createElement("button");
    this.buttons["toggleBlackCS"].innerText = "Black controlled squares";
    this.buttons["previous"] = document.createElement("button");
    this.buttons["previous"].innerText = "Previous move";
    this.buttons["next"] = document.createElement("button");
    this.buttons["next"].innerText = "Next move";
    this.movesList.setAttribute("class", "moves-list");
    this.movesList.innerHTML = "Normlanie lista ruchów tu będzie";


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
      let history = this.gameController.movesHistory;
      
      if(history.length+this.histPos-1<=0) return;
      this.board.removePieces();
      this.histPos--
      this.board.readFEN(history[history.length+this.histPos-1].board)

      if(this.showCsW){
        board.getControlledSquares();
        board.showControlledSquares(true);
      }else if(this.showCsB){
        board.getControlledSquares();
        board.showControlledSquares(false);
      }
      this.updateCurrentMove(-1)

    })

    this.buttons["next"].addEventListener("click", ()=>{
      
      let history = this.gameController.movesHistory;
      
      if(this.histPos>=0) return;
      this.board.removePieces();
      this.histPos++
      // if(this.histPos<0) this.histPos *=-1;
      this.board.readFEN(history[history.length+this.histPos-1].board)
      
      if(this.showCsW){
        board.getControlledSquares();
        board.showControlledSquares(true);
      }else if(this.showCsB){
        board.getControlledSquares();
        board.showControlledSquares(false);
      }

      this.updateCurrentMove(1)

    })

    for (const btn of Object.keys(this.buttons)) {
      document.body.append(this.buttons[btn])
    }
    document.body.appendChild(this.movesList)
  }

  updateMoves(movesHistory){
    this.movesList.innerHTML = "Normlanie lista ruchów tu będzie";
    
    let i=0;
    // .style.color = "#f0f";
    movesHistory.forEach(({move}) => {
      this.movesList.innerHTML += "<div>"+move+"</div>";
      i++;
    });

    // this.updateCurrentMove(0)

  }
  
  updateCurrentMove(d){
    
    if(d>0){
      this.currentMove++;
    }else if(d<0){
      this.currentMove--;
    }
    
      this.movesList.childNodes[this.currentMove].style.color = "#a5a"
  }
}

export default UserInterface;