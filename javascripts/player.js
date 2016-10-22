"use strict";
let Robot = require("robot.js");

function Player(name, type){

  let robotType = {};

  // Define three robot type functions (Drone, Bipedal, ATV).
  robotType.Drone = function(name) {
    Robot.call(this, name);
    this.type = "Drone";
  };
  robotType.Drone.prototype = new Robot();

  robotType.Bipedal = function(name) {
    Robot.call(this, name);
    this.type = "Bipedal";
  };
  robotType.Bipedal.prototype = new Robot();

  robotType.ATV = function(name) {
    Robot.call(this, name);
    this.type = "ATV";
  };
  robotType.ATV.prototype = new Robot();
  return new robotType[type](name);
}

module.exports = Player;