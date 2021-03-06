class MovesHistory{
  constructor(){
    this.moves = {};
    this.movesMap = {};
    this.length = 0;
  }

  set(data){
    let key = data.pos.split(" ")[0];
    if(this.moves[key]){
      this.moves[key].push({
        id: this.length,
        move: data.move,
        pos: data.pos
      });
      this.length++;
      return;
    }
    this.moves[key] = [{
      id: this.length,
      move: data.move,
      pos: data.pos
    }];
    this.length++;
  }

  get(pos){
    if(!this.moves[pos]) return;
    return this.moves[pos];
  }

  countRepeat(pos){
    return this.moves[pos].length;
  }
  
  forEach(func){
    for (const key in this.moves) {
      if(this.moves[key].length>1){
        for (let i = 0; i < this.moves[key].length; i++) {
          func(this.moves[key][i]);
        }
      }else if(this.moves[key].length==1){
        func(this.moves[key][0]);
      }
    }
  }

  mapToId(){
    for (const key in this.moves) {
      if(this.moves[key].length>1){
        for (let i = 0; i < this.moves[key].length; i++) {
          const e = this.moves[key][i];
          this.movesMap[e.id] = e;
        }
      }else{
        const e = this.moves[key][0];
        this.movesMap[e.id] = e;
      }
    }
  }
}

export default MovesHistory;