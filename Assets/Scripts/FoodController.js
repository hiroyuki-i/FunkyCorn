#pragma strict

var foodBagState : boolean = false;
private var corn : GameObject;
private var cornClone : GameObject;

function Start () {
	corn = Resources.Load("Corn");
}

function Update () {
	
	if(Input.touchCount > 0){
		var touchPoint : Vector2 = Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position);
	}
	if(Input.GetMouseButton(0)){
		touchPoint = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	}
	
	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began) || Input.GetMouseButtonDown(0) ){
		var touchObject : Collider2D  = Physics2D.OverlapPoint(touchPoint);
		if(touchObject){
			var hitObject : RaycastHit2D = Physics2D.Raycast(touchPoint,-Vector2.up);
			if(hitObject.collider.gameObject.name == "FoodBag"){
				cornClone = Instantiate(corn,touchPoint,corn.transform.rotation);
				foodBagState = true;
			}
		}
	}
	
	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Moved) || Input.GetMouseButton(0) ){
		if(foodBagState == false){
			return;
		}
		cornClone.transform.position = touchPoint;	
	}

	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Ended) || Input.GetMouseButtonUp(0) ){
		//cornClone.transform.position = touchPoint;
		foodBagState = false;
	}

}