class UserInterface{
  constructor(){
    this.buttons = {};
    this.showCs = false;
    this.csWhite = true;
  }

  init(board){
    //create buttons for hilighting squares controlled by each color
    this.buttons["toggleWhiteCS"] = document.createElement("button");
    this.buttons["toggleWhiteCS"].innerText = "White controlled squares";
    this.buttons["toggleBlackCS"] = document.createElement("button");
    this.buttons["toggleBlackCS"].innerText = "Black controlled squares";
    this.buttons["hideCS"] = document.createElement("button");
    this.buttons["hideCS"].innerText = "Hide controlled squares";

    this.buttons["toggleWhiteCS"].addEventListener("click", ()=>{
      this.showCs = true;
      if(this.showCs){
        this.csWhite = true;
        board.getControlledSquares();
        board.showControlledSquares(this.csWhite);
      }
    })

    this.buttons["toggleBlackCS"].addEventListener("click", ()=>{
      this.showCs = true;
      if(this.showCs){
        this.csWhite = false;
        board.getControlledSquares();
        board.showControlledSquares(this.csWhite);
      }
    })

    this.buttons["hideCS"].addEventListener("click", ()=>{
      this.showCs = false;
      board.removeControlledSquares();
    })

    for (const btn of Object.keys(this.buttons)) {
      document.body.append(this.buttons[btn])
    }
  }
}

export default UserInterface;