require(['./board', './life'], function(Board, Life) {
  Math.seedrandom("");

  function seedFunction(row, col) {
    if(Math.random() < 0.5){
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
