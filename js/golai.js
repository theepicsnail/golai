require(['./board'], function(Board) {
  Math.seedrandom("");

  var fill_precent = 0.5;
  function seedFunction(row, col) {
    if(Math.random() < fill_percent){
      return new Life();
    }
    return null;
  }

  var b = new Board(10,10, seedFunction );
  b.advanceState();
  window.b = b;
  n = setInterval(b.advanceState.bind(b), 200);
  window.stop = function() {
    clearInterval(n);
  };
});
