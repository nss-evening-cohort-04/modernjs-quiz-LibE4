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