#pragma strict

private var isHoldCorn : boolean = false;
private var corn : GameObject;
private var cornClone : GameObject;

function Start () {
	corn = Resources.Load("Corn");
}

function Update () {
	
	if(Input.touchCount > 0){
		var touchPoint : Vector2 = Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position);
	}
	if(Input.GetMouseButton(0) || Input.GetMouseButtonDown(0)){
		touchPoint = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	}
	
	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began) || Input.GetMouseButtonDown(0) ){
		var touchObject : Collider2D[]  = Physics2D.OverlapPointAll(touchPoint);
		for(var i = 0; i< touchObject.length; i++ ){
			Debug.Log(touchObject[i].gameObject.name);
			if(touchObject[i].gameObject.name == "FoodBag"){
				cornClone = Instantiate(corn,touchPoint,corn.transform.rotation);
				isHoldCorn = true;
				break;
			}
			if(touchObject[i].gameObject.name == "Corn(Clone)"){
				cornClone = touchObject[i].gameObject;
				isHoldCorn = true;
				break;
			}
		}
	}
	
	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved) || Input.GetMouseButton(0) ){
		if(isHoldCorn == false){
			return;
		}
		cornClone.transform.position = touchPoint;	
	}

	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Ended) || Input.GetMouseButtonUp(0) ){
		isHoldCorn = false;
	}

}