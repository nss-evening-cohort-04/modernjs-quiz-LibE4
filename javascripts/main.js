"use strict";
let Player = require("player.js");


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
        playerA = new Player(nameA, typeA);
        playerA.getModel(modelA);
        playerB = new Player(nameB, typeB);
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
