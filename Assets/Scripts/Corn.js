#pragma strict

var hp : int = 100;

function update(){
	rigidbody.WakeUp();
}

function OnTriggerStay(){
	Debug.Log("corn eat! hp:" + hp);
	if(hp == 0){
		Destroy(gameObject);
	}
	hp--;
}