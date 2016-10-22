"use strict";
let Model = require("model.js");

  // A base Robot function.
function Robot(name){
  this.name = name;
  this.type = null;
  this.model = null;
  this.totalDamage = 0;
  this.health = 100;
  this.toString = function() {
    let output = [this.name,
      ": ",
      this.model,
      " ",
      this.type,
      this.class,
      " with ",
      this.health,
      " health, can make ",
      this.totalDamage,
			" total damage!"
    ].join("");
    return output;
  };
}
Robot.prototype.attack = function (target) {
  target.health -= this.totalDamage;
};

Robot.prototype.getModel = function(model){
  let myRobotModel = new Model(model);
  this.model = model;
  this.health = myRobotModel.health;
  this.totalDamage = myRobotModel.damage;
};

module.exports = Robot;

