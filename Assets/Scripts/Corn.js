#pragma strict

var hp : int = 100;
var subtractionValue : int = 1;
var isActive : boolean = false;
var chickenCount : int = 0;


function update(){

}

function eat(){
	hp -= subtractionValue;
	if(hp < 0){
		Destroy(gameObject);
		return false;
	}
	return true;
}

function getChickenCount(){
	return chickenCount;
}

function chickenEntry(){
	chickenCount += 1;
}

function chickenLeave(){
	chickenCount -= 1;
}
