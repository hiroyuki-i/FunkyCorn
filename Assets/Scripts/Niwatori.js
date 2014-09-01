#pragma strict

private var movingStepInterval : float = 0.0;
private var countActiveCornInPrevFrame : int = 0;
//private var isFood : boolean = false;
private var targetCorn : GameObject;
private var anime : Animator;

function Start(){
	anime = GetComponent(Animator);
}

function Update () {
	if(isFood()){
		return;
	}
	randomPositioning();
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
		
		if(chickenCountToVacantestCorn < chickenCountInNearestCorn && chickenCountToVacantestCorn == 0){
			targetCorn = Corns[vacantestCornIndex];
		}else{
			targetCorn = Corns[nearestCornIndex];
		}
		
		targetCorn.GetComponent(Corn).chickenEntry();
	}
	
	movingStepInterval += Time.deltaTime;
	if(movingStepInterval > 0.05){
		if(anime.GetBool("isEating") == false){
			var fromX = transform.position.x;
			var fromY = transform.position.y;
			var x = (fromX < targetCorn.gameObject.transform.position.x) ? 1 : -1;
			var y = (fromY < targetCorn.gameObject.transform.position.y) ? 1 : -1;
			var distanceX =  Vector3.Distance(new Vector3(fromX + 0.4 * x , fromY , 0),targetCorn.gameObject.transform.position);
			var distanceY =  Vector3.Distance(new Vector3(fromX ,fromY + 0.4 * y , 0),targetCorn.gameObject.transform.position);	
			if(distanceX < distanceY){
				y = 0;
			}else{
				x = 0;
			}
			move(x,y,true);
		}
		movingStepInterval = 0;
	}
	return true;
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
		this.move(x , y , false);
	}
}

function move(x : int, y : int, run){
	anime.SetInteger("x",x);
	anime.SetInteger("y",y);
	if(run){
		anime.speed = 1;
	}else{
		anime.speed = 0.2;
	}
	transform.position += new Vector3(x * 0.4, y * 0.4, 0);
}

function OnTriggerEnter2D(c : Collider2D){
	if(c.gameObject.transform.name == "Corn(Clone)"){
		anime.SetBool("isEating",true);
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
		anime.SetBool("isEating",false);
	}
}

function OnNiwatoriEatEnd(){
	anime.SetBool("isEating",false);
}
