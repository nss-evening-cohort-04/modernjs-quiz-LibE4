(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const Player = require("./player.js");


// handle all events here
$(document).ready(()=> {
  let playerA = "";
  let playerB = "";
  let robotA = "";
  let robotB = "";
  let playerALife = "";
  let playerBLife = "";
  let nRound;
  let roundBtn = $(".round");
  let livereport = $(".livereport");
  let fighthBtn = $(".card_fight");
 
  /*
    Show the initial view that accepts user input
   */
  $("#player-setup").show();

  /*
    When any button with card__link class is clicked,
    move on to the next view.
   */
  $(".card__link").click(function(e) {
    e.stopPropagation();
    
      $(".card").hide();
      $(".card--battleground").show();
      // on page load...
			  let nameA = $("#player-a").val();
			  let nameB = $("#player-b").val();
			  let selectA = $("#robot-a option:selected").val();
			  let selectB = $("#robot-b option:selected").val();
        let modelA = selectA.split(" ")[0];
        let typeA = selectA.split(" ")[1];
        let modelB = selectB.split(" ")[0];
        let typeB = selectB.split(" ")[1];
        playerA = Player(nameA, typeA);
        playerA.getModel(modelA);
        playerB = Player(nameB, typeB);
        playerB.getModel(modelB);
        playerALife = playerA.health;
        playerBLife = playerB.health;
        $(".playerA-profile").html(playerA.toString());
        $(".playerB-profile").html(playerB.toString());

        setGame();
  });

  /*
    When the back button clicked, move back a view
   */
  $(".card__back").click(function(e) {
    playerA = "";
    playerB = "";
    $(".avatar").remove();
    let previousCard = $(this).attr("previous");
    $(".card").hide();
    $("." + previousCard).show();
  });

  // attack button action (playerA vs playerB)
  $(fighthBtn).click(function(){
    let btnText = $(this).find(".btn__text").text().toLowerCase();
    if(btnText === "Attack".toLowerCase()){
      fight();
    } else if(btnText === "play again".toLowerCase()){
      playAgain();
    }
    $(this).css("background-color", "green");
  });
  
  function fight(){
    while(playerA.health > 0 && playerB.health > 0){
      playerA.attack(playerB);
      moveProgressBar(playerB.health, playerBLife, "#playerBWrap", "#playerBProgress");
      $(livereport).append(`<div>Round ${nRound}: playerA's attack caused ${playerA.totalDamage} damage</div>`);
      if(playerB.health <= 0){
        $(roundBtn).html(`${playerA.name} Wins!`);
        endGame();
        return;
      }

      playerB.attack(playerA);
      moveProgressBar(playerA.health, playerALife, "#playerAWrap", "#playerAProgress");
      $(livereport).append(`<div>playerB's attack caused ${playerB.totalDamage} damage</div>`);
      $(roundBtn).html(`round ${++nRound}`);
      if (playerA.health <= 0){
        $(roundBtn).html(`${playerB.name} Wins!`);
        endGame();
        return;
      }
    }
  } // end of fight function

  function playAgain(){
    playerA.health = playerALife;
    playerB.health = playerBLife;
    setGame();
    $(fighthBtn).find(".btn__text").text("Attack"); 
  } // end of playAgain function

  function endGame(){
    $(fighthBtn).css("background-color", "green").find(".btn__text").text("play again");
  } // end of endGame function

  function setGame(){
    nRound = 1;
    $(roundBtn).html(`round ${nRound}`);
    $(livereport).html("");
    moveProgressBar(playerB.health, playerBLife, "#playerBWrap", "#playerBProgress");
    moveProgressBar(playerA.health, playerALife, "#playerAWrap", "#playerAProgress");
    $(fighthBtn).css("background-color", "green").find(".btn__text").text("Attack");
  } // end of resetRoundBtn function

  // SIGNATURE PROGRESS
  function moveProgressBar(updatedLife, fullLife, wrap, progress) {
    let getPercent = updatedLife / fullLife;
    let getProgressWrapWidth = $(wrap).width();
    let progressTotal = Math.max(getPercent, 0) * getProgressWrapWidth;
    let animationLength = 0;
    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $(progress).stop().animate({
        left: progressTotal
    }, animationLength);
  } // end of moveProgressBar function

}); // end of document ready function

},{"./player.js":3}],2:[function(require,module,exports){
"use strict";

function Model(model){
	let robotModel = {};
	robotModel.Aerial = function(){
		this.health = 50 + Math.ceil(Math.random() * 30);
		this.damage = 10 + Math.ceil(Math.random() * 5);
	};
	robotModel.Ground = function(){
		this.health = 60 + Math.ceil(Math.random() * 60);
	  this.damage = 15 + Math.ceil(Math.random() * 5);
	};
  model = model.charAt(0).toUpperCase() + model.slice(1).toLowerCase();
  return new robotModel[model]();
}

module.exports = Model;
},{}],3:[function(require,module,exports){
"use strict";
const Robot = require("./robot.js");

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
},{"./robot.js":4}],4:[function(require,module,exports){
"use strict";
const Model = require("./model.js");

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
  let myRobotModel = Model(model);
  this.model = model;
  this.health = myRobotModel.health;
  this.totalDamage = myRobotModel.damage;
};

module.exports = Robot;


},{"./model.js":2}]},{},[1]);
