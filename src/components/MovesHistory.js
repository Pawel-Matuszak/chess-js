class MovesHistory{
  constructor(){
    this.moves = {};
    this.length = 0;
  }

  set(data){
    if(this.moves[data.pos]){
      this.moves[data.pos].push(data);
      this.length++;
      return;
    }
    this.moves[data.pos] = [data];
    this.length++;
  }

  get(pos){
    if(!this.moves[pos]) return;
    return this.moves[pos];
  }

  getById(id){
    for (const key in this.moves) {
      if(this.moves[key].length>1){
        for (let i = 0; i < this.moves[key].length; i++) {
          const e = this.moves[key][i];
          if(e.id==id) return e;
        }
      }else{
        if(this.moves[key][0].id==id) return this.moves[key][0];
      }
    }
    return null;
  }

  countRepeat(pos){
    return this.moves[pos].length;
  }
}