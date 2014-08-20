#pragma strict

private var cornState : boolean = false;
private var startTime : float;

function Update () {
	if(isFood()){
		return;
	}
	var rand = parseInt(Random.Range(0.0 ,500.0));
	switch(rand){
		case 1 :
			var x = 0;
			var y = 1;
			break;
		case 2 :
			x = 0;
			y = -1;
			break;
		case 3 :
			x = -1;
			y = 0;
			break;
		case 4 :
			x = 1;
			y = 0;
			break;
		default :
			x = 0;
			y = 0;
			break;
	}
	positioning(x,y);
}

function positioning(x : int , y : int){
	if(x == 0 && y == 0){
		return;
	}
	transform.position += new Vector3(x * 0.5, y * 0.5, 0);
	transform.eulerAngles = Vector3(0, 0, 0);
}

function isFood(){
	var Corns = GameObject.FindWithTag("CornTag");
	if(Corns == null){
		cornState = false;
		return false;
	}
	if(cornState == false && Corns != null){
		startTime = Time.time;
	}
	var t = (Time.time - startTime) / 8.0;
	transform.position = Vector3(
		Mathf.SmoothStep(transform.position.x,Corns.transform.position.x,t),
		Mathf.SmoothStep(transform.position.y,Corns.transform.position.y,t),0);
	cornState = true;
	
	return true;
}

function OnTriggerStay(c : Collider){
	Debug.Log(c.gameObject.transform.name);
	if(c.gameObject.transform.name == "Corn(Clone)"){
		//var cornComp = c.GetComponents(Corn);
		
		//cornComp.eated(); 
	}
}