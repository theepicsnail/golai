define([], function(){
  return {
    create2DArray: function(rows, cols, filler) {
      /* Create a 2d array filled with filler(row, col), or null */
      var out = [];
      var i;
      for (i = 0 ; i < rows ; i++) {
        out[i] = [];
        for(j = 0 ; j < cols ; j++) {
          out[i][j] = filler ? filler(i,j): null;
        }
      }
      return out;
    },
    randInt: function(low, high) {
      /* randInt(10) -> [0,1,2,..9]
       * randInt(3,6) -> [3,4,5]
       */
      if(high === undefined) {
        high = low;
        low = 0;
      }
      return Math.floor(Math.random()*(high-low)+low);
    },
    floatToHex: function(f) {
      return ((1+f) * 255).toString(16).substring(1,3);
    }
  };
});
