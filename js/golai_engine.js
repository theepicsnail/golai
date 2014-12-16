define(['./life', './utils', './actions'], function(Life, U, A) {

  resolveCollision = function (cells) {
    /*
     * Returns either a Cell (the survivor of a fight)
     * or A.BREED if breeding was done, and children need created.
     */
    function fight(cells) {
      var attacker = cells[U.randInt(cells.length)];
      var v_id = U.randInt(cells.length);
      var victim = cells[v_id];
      if(attacker === victim) {
        return;
      }
      victim.health -= attacker.getAttack();
      if (victim.health <=0 ) {
        cells.splice(v_id, 1);
      }

    }

    while(cells.length > 2) {
      fight(cells);
    }

    if(cells.length != 2)
      console.warn("More than 2 cells alive at invalid point in time.", cells.length);

    var a1 = cells[0].fightOrBreed(cells[1].getVisibleState());
    var a2 = cells[1].fightOrBreed(cells[0].getVisibleState());

    if (a1 == A.BREED && a2 == A.BREED) {
      return A.BREED;
    } else {
      while(cells.length > 1) {
        fight(cells);
      }
      return cells[0];
    }

  };


  function update(board) {
    var ROWS = board.getRows(), COLS = board.getCols();

    tempCells = U.create2DArray(ROWS, COLS, function(){return [];});
    var r, c, state, move, newr, newc, c_id;

    // Move each cell into tempCells where it wants to go. (allows collisions)
    var collisions = [];
    var senses = [[-1,0],[1,0],[0,1],[0,-1]]; // relative locations to sense
    for(r = 0; r < ROWS ; r ++) {
    for(c = 0; c < COLS ; c ++) {
      var cell = board.getCell(r,c);

      if (cell === null) {
        continue;
      }


      state = [];
      for(var senseid = 0; senseid < senses.length ; senseid++) {
        var tmpcell = board.getCell(r+senses[senseid][0], c+senses[senseid][1]);
        if (tmpcell !== null)
          state = state.concat(tmpcell.getVisibleState());
        else
          state = state.concat([0,0,0]); // Same length as Life.getVisibleState value
      }

      move = cell.react(state);
      newr = r;
      newc = c;

      switch(move) {
        case A.LEFT: newc --; break;
        case A.RIGHT: newc ++; break;
        case A.UP: newr --; break;
        case A.DOWN: newr ++; break;
      }

      newr = (newr+ROWS)%ROWS;
      newc = (newc+COLS)%COLS;

      var count = tempCells[newr][newc].push(cell);
      if (count === 2) { //only push on the first collision
        collisions.push([newr, newc]);
      }
    }}


    var that=this;
    function placeChildNear(row, col, child) {
      /* attempt to place a child near row/col. */
      newr = (row+U.randInt(-1,2) + that.rows)%that.rows;
      newc = (col+U.randInt(-1,2) + that.cols)%that.cols;
      if(tempCells[newr][newc].length === 0) {
        tempCells[newr][newc].push(child);
      }
    }

    // Resolve collisions
    for(c_id = 0; c_id < collisions.length ; c_id ++) {
      var c_row = collisions[c_id][0];
      var c_col = collisions[c_id][1];

      var resolution = resolveCollision(tempCells[c_row][c_col]);
      if (resolution == A.BREED) {
        var p1 = tempCells[c_row][c_col][0];
        var p2 = tempCells[c_row][c_col][1];
        tempCells[c_row][c_col].splice(U.randInt(2),1); // kill a random parent
        // try to place 2 children.
        c1 = new Life(p1, p2);
        c2 = new Life(p1, p2);
        placeChildNear(c_row, c_col, c1);
        placeChildNear(c_row, c_col, c2);
      }
    }

    // Copy the resolved board onto the cell array
    for(r = 0; r < ROWS ; r ++) {
    for(c = 0; c < COLS ; c ++) {
      if(tempCells[r][c].length === 0) {
        board.setCell(r,c,null);
      } else if(tempCells[r][c].length === 1) {
        board.setCell(r,c, tempCells[r][c][0]);
      } else {
        console.warn("Unresolved collision at",r,c, tempCells[r][c]);
      }
    }}


  }


  return {
    seedFunction: function(){ return Math.random() < 0.5 ? new Life() : null; },
    updateFunction: update
  };
});
