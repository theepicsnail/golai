define(["./utils", "./life", "./actions"], function(U, Life, A) {
  var canvas = document.getElementsByTagName("canvas")[0];
  var ctx = canvas.getContext("2d");

  function Board(rows, cols, seedFunction) {
    this.rows = rows;
    this.cols = cols;
    this.oldCells = U.create2DArray(this.rows, this.cols);
    this.cells = U.create2DArray(this.rows, this.cols, seedFunction);

    this.update();

  }

  Board.prototype.update = function () {
    /*
     * Compare the current cells array to the old one
     * redraw any differences and update the old array
     */
    var i,j;
    for(i = 0; i < this.rows ; i ++) {
    for(j = 0; j < this.cols ; j ++) {
      if (this.oldCells[i][j] !== this.cells[i][j]) {
        this.oldCells[i][j] = this.cells[i][j];
        this.drawCell(i*10, j*10, 10, 10, this.cells[i][j]);
      }
    }}
  };

  Board.prototype.drawCell = function(x,y,w,h, cell) {
    if(cell === null)
      ctx.fillStyle="white";
    else
      ctx.fillStyle= cell.getColor();
    ctx.fillRect(x,y,w,h);
  };

  Board.prototype.cellAt = function(row, col) {
    /* Get the cell at the specified location, this supports
     * overflow and negative locations. */
    row = (row%this.rows+this.rows)%this.rows;
    col = (col%this.cols+this.cols)%this.cols;
    return this.cells[row][col];
  };

  Board.prototype.advanceState = function() {
    tempCells = U.create2DArray(this.rows, this.cols, function(){return [];});
    var r, c, state, move, newr, newc, c_id;

    // Move each cell into tempCells where it wants to go. (allows collisions)
    var collisions = [];
    var senses = [[-1,0],[1,0],[0,1],[0,-1]]; // relative locations to sense
    for(r = 0; r < this.rows ; r ++) {
    for(c = 0; c < this.cols ; c ++) {
      if (this.cells[r][c] === null) {
        continue;
      }


      state = [];
      for(var senseid = 0; senseid < senses.length ; senseid++) {
        var cell = this.cellAt(r+senses[senseid][0], c+senses[senseid][1]);
        if (cell !== null)
          state = state.concat(cell.getVisibleState());
        else
          state = state.concat([0,0,0]); // Same length as Life.getVisibleState value
      }

      move = this.cells[r][c].react(state);
      newr = r;
      newc = c;

      switch(move) {
        case A.LEFT: newc --; break;
        case A.RIGHT: newc ++; break;
        case A.UP: newr --; break;
        case A.DOWN: newr ++; break;
      }

      newr = (newr+this.rows)%this.rows;
      newc = (newc+this.cols)%this.cols;

      var count = tempCells[newr][newc].push(this.cells[r][c]);
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

      var resolution = this.resolveCollision(tempCells[c_row][c_col]);
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
    for(r = 0; r < this.rows ; r ++) {
    for(c = 0; c < this.cols ; c ++) {
      if(tempCells[r][c].length === 0) {
        this.cells[r][c] = null;
      } else if(tempCells[r][c].length === 1) {
        this.cells[r][c] = tempCells[r][c][0];
      } else {
        console.warn("Unresolved collision at",r,c, tempCells[r][c]);
      }
    }}
    this.update(); // redraw
  };

  Board.prototype.resolveCollision = function (cells) {
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

  return Board;
});
