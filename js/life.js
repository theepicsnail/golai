define(["./actions", "./utils", "./genes"], function(A, U, Genes) {
  function Life(p1, p2) {
    if (p1 === undefined) {
      genes = Genes.randomGenes();
    } else if (p2 === undefined) {
      console.warn("Life created with only 1 parent.");
      genes = Genes.merge(p1.genes, p1.genes);
    } else {
      genes = Genes.merge(p1.genes, p2.genes);
    }
    this.genes = genes;

    this.age = 0;
    this.health = this.genes.max_health;
    this.attack = this.genes.max_attack;
  }

  Life.prototype.getVisibleState = function() {
    /*
     * What does an observer of 'this' have the ability to see.
     */
    return [1, this.health, this.attack];
  };

  Life.prototype.fightOrBreed = function(otherCellState) {
    return Math.random() > this.genes.max_health ? A.FIGHT: A.BREED;
  };

  Life.prototype.getAttack = function() {
    return this.attack;
  };

  Life.prototype.getHealth = function() {
    return this.health;
  };

  Life.prototype.react = function(state) {
    //console.log(state);
    return [A.NONE, A.UP, A.DOWN, A.LEFT, A.RIGHT][U.randInt(5)];
  };

  Life.prototype.getColor = function() {
    return "#" + U.floatToHex(this.attack)
               + U.floatToHex(this.health)
               + "00";
  };

  return Life;
});
