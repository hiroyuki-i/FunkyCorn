#pragma strict

private var countActiveCornInPrevFrame : int = 0;
private var isEating : boolean = false;
private var startTime : float;
private var targetCorn : GameObject;

function Start(){
}

function Update () {
	if(isFood()){
		return;
	}
	randomPositioning();
}

function randomPositioning(){
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
	if(x != 0 || y != 0){
		transform.position += new Vector3(x * 0.5, y * 0.5, 0);
	}
}

function isFood(){

	var Corns = GameObject.FindGameObjectsWithTag("CornTag");
	var countActiveCorn = 0;
	for(var i = 0; i < Corns.length; i++){
		if(Corns[i].gameObject.GetComponent(Corn).isActive){
			countActiveCorn++;
		} 	
	}
	if(countActiveCorn == 0){
		targetCorn = null;
		return false;
	}

	if(countActiveCorn > countActiveCornInPrevFrame){
		targetCorn = null;
	}
	countActiveCornInPrevFrame = countActiveCorn;
	
	if(targetCorn == null){
		var nearestCornIndex = 0;
		var nearestCornDistance =  999999;
		var vacantestCornIndex = 0;
		var vacantestCornChickenCount = 999999;
	 	for( i = 0; i < Corns.length; i++){
			if(Corns[i].gameObject.GetComponent(Corn).isActive == false){
				continue;
			} 
	 		var distance = Vector3.Distance( gameObject.transform.position, Corns[i].gameObject.transform.position);
	 		if(nearestCornDistance > distance){
				nearestCornIndex = i;
				nearestCornDistance = distance;
	 		}
	 		var chickenCount = Corns[i].gameObject.GetComponent(Corn).getChickenCount();
	 		if(vacantestCornChickenCount >= chickenCount){
	 			vacantestCornIndex = i;
	 			vacantestCornChickenCount = chickenCount;
	 		}
	 	}
	 	var chickenCountInNearestCorn = Corns[nearestCornIndex].gameObject.GetComponent(Corn).getChickenCount() - 1;
		
		var Chickens = GameObject.FindGameObjectsWithTag("ChickenTag");
		var chickenCountToVacantestCorn = 0;
		for(i = 0; i < Chickens.length; i++){
			if(gameObject.GetInstanceID() != Chickens[i].gameObject.GetInstanceID()){
				distance = Vector3.Distance( Chickens[i].gameObject.transform.position, Corns[vacantestCornIndex].gameObject.transform.position);
				if(nearestCornDistance > distance){
					chickenCountToVacantestCorn++;
				}
			}
		}
		Debug.Log(gameObject.GetInstanceID() + ":" + chickenCountToVacantestCorn);
		if(chickenCountToVacantestCorn < chickenCountInNearestCorn){
			targetCorn = Corns[vacantestCornIndex];
		}else{
			targetCorn = Corns[nearestCornIndex];
		}
		
		targetCorn.GetComponent(Corn).chickenEntry();
		startTime = Time.time;	//SmoothStep param.
	}
	
	if(isEating == false){
		var t = (Time.time - startTime) / 8.0;
		transform.position = Vector3(
								Mathf.SmoothStep(transform.position.x,targetCorn.gameObject.transform.position.x,t),
								Mathf.SmoothStep(transform.position.y,targetCorn.gameObject.transform.position.y,t),0);
	}
	return true;
}

function OnTriggerEnter2D(c : Collider2D){
	if(c.gameObject.transform.name == "Corn(Clone)"){
		audio.Play();
	}
}

function OnTriggerStay2D(c : Collider2D){
	if(c.gameObject.transform.name == "Corn(Clone)"){
		c.gameObject.GetComponent(Corn).eat();
	}
}

function OnTriggerExit2D(c : Collider2D){
	if(c.gameObject.transform.name == "Corn(Clone)"){
		targetCorn = null;
	}
}
