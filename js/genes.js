define([], function() {
  var Genes = {};

  Genes.randomGenes = function() {
    return {
      max_health: Math.random(),
      max_attack: Math.random(),
      breed_chance: Math.random(),
    };
  };

  function merge(parent0, parent1, min, max) {
    var parent_bias = Math.random();
    // Weighted value from parents
    var desired_value = parent0*(1-parent_bias) + parent1*(parent_bias);

    var value = desired_value * (1 + .01 * Math.random()); // mutate.

    return Math.min(max, Math.max(min, value)); // truncate.

  }

  Genes.merge = function(parent0, parent1) {
    var out = {}, attrName;
    for(attrName in parent0) {
      if(parent1.hasOwnProperty(attrName)) {
        out[attrName] = merge(parent0[attrName], parent1[attrName], 0, 1);
      } else {
        out[attrName] = parent0[attrName];
      }
    }
    for(attrName in parent1) {
      if(parent0.hasOwnProperty(attrName)) {
        continue;
      } else {
        out[attrName] = parent1[attrName];
      }
    }
    return out;
  };

  return Genes;
});
