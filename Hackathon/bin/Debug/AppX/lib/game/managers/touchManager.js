ig.module(
		'game.managers.touchManager'
)
.requires(
		'impact.entity', 
		'game.managers.geometryManager',
		'game.managers.resizeManager',
        'game.managers.popManager2',
        'game.managers.itemManager',
        'game.managers.entityManager',
        'game.entities.salad'
)
.defines(function(){
	EntityTouchManager = ig.Class.extend({	
		
	    //newly defined property
	    isTouched: false,
	    isDragged: false,	//for bound settings
	    isHorizontal: false,	//for bound settings
	    isAfterReleased: true,
	    nodEntity: null,
	    currentEntity: null,
	    currentVerticalEntities: new Array(17),
	    currentHorizontalEntities: new Array(17),
	    popManager: null,
	    itemManager: null,
	    entityManager: null,
	    popManager2: null,
	    //realLengthOfMap : 8,
	    lastPos: { x: 0, y: 0 },
	    difPos: { x: 0, y: 0 },
	    nodTimer: null,
        itemTimer: null,



		init: function(pop,time) {
		    this.popManager2 = pop;
		    this.nodTimer = new ig.Timer(0.5);
		    this.itemTimer = new ig.Timer(4);
		    this.itemManager = new ItemManager(time);
		    this.entityManager = new EntityManager();

		    // WinJS.UI.ViewBox 용도 해상도별 계산시 사용
		    ResizeManager.getCurrent_Real = function () { return 1; }
		    ResizeManager.getReal_Current = function () { return 1; }
		},



		update: function () {
		    if (this.nodTimer.delta() > 0) {
		        this.changeNodEntity();
		    }
		    if (this.itemTimer.delta() > 0) {
		        this.itemManager.testClearItem();
		        this.itemTimer.reset();
		    }

			if(this.isAfterReleased){
			    this.isAfterReleased = false;
			    this.popManager2.check();
			}
			this.popManager2.update();

		    //touchBegan
			if(ig.input.pressed('touch')){
			    this.isTouched = true;

				var count = 1;

				//가로 세로 8개씩 카운트 하기 위한 
				var verticalCount = 0;
				var horizontalCount = 0;
				//현재 클릭한 포인트 위
				var mousePointX = ig.input.mouse.x;
				var mousePointY = ig.input.mouse.y;


			    /*************************************************************************************************************/
			    // 마우스 x, y 값으로 현재 selected 된 entity 확인
				this.currentEntity = this.entityManager.getSelectedEntity(mousePointX, mousePointY);
				if (this.currentEntity == null) return;
				if (!this.currentEntity.blocked)
				    this.currentEntity.updateState('touch');

			    ////////////////////////////////////////////////////////////////////
			    // 안보이는곳의 엔티티를 추가하자.
			    //this.entityManager.addHidingEntities(mousePointX, mousePointY);

				var entities = this.entityManager.getSaladEntities();
                //var entities = ig.game.entities;
				for (var i = 0; i < entities.length; i++) {	//현재 마우스 포인트가 어느 엔티티인지 파악하자.
				    var thisEntity = entities[i];
				    var realX = entities[i].pos.x;
				    var realY = entities[i].pos.y;
				    var minX = realX * ResizeManager.getCurrent_Real();
				    var minY = realY * ResizeManager.getCurrent_Real();
				    var maxX = (realX + 70) * ResizeManager.getCurrent_Real();
				    var maxY = (realY + 70) * ResizeManager.getCurrent_Real();

				    
				    var thisEntity = entities[i];
				    if (((minX < mousePointX) && (maxX > mousePointX))) {	//현재 마우스 클릭을 한 엔티티의 세로축에 있는 모든 엔티티
				        var en = ig.game.spawnEntity(Salad, realX, realY + 560, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
				        en.isInside = false;
				        
				        if (thisEntity.attachedItem != null)
				            this.itemManager.setItem(thisEntity.attachedItem.itemType, en);
				        
				        if ((maxY >= mousePointY))
				            en.pos.y = realY - 560;
				    }
				    if (((minY < mousePointY) && (maxY > mousePointY))) {	//현재 마우스 클릭을 한 엔티티의 가로축에 있는 모든 엔티티
				        var en = ig.game.spawnEntity(Salad, realX + 560, realY, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
				        en.isInside = false;
				        
				        if (thisEntity.attachedItem != null)
				            this.itemManager.setItem(thisEntity.attachedItem.itemType, en);
				        
				        if ((maxX >= mousePointX))
				            en.pos.x = realX - 560;
				    }
				    if ((minX < mousePointX) && (maxX > mousePointX) && (minY < mousePointY) && (maxY > mousePointY)) {
				        var en = ig.game.spawnEntity(Salad, realX, realY + 560, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
				        var en2 = ig.game.spawnEntity(Salad, realX + 560, realY, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
				        en.isInside = false;
				        en2.isInside = false;
				        
				        if (thisEntity.attachedItem != null) {
				            this.itemManager.setItem(thisEntity.attachedItem.itemType, en);
				            this.itemManager.setItem(thisEntity.attachedItem.itemType, en2);
				        }
				        
				    }

				}

                ////////////////////////////////////////////////////////////////////
			
                // 세로줄 엔티티
				this.currentVerticalEntities = this.entityManager.getVerticalEntities(mousePointX, mousePointY);
			    // 가로줄 엔티티
				this.currentHorizontalEntities = this.entityManager.getHorizontalEntities(mousePointX, mousePointY);

                // last mouse point 저장
				if (this.currentEntity != null) {
				    lastPos = { x: ig.input.mouse.x, y: ig.input.mouse.y };
				}


                /*************************************************************************************************************/
			    // block the verticalEntity of the blocked column
				if (this.entityManager.containsHurdle(this.currentVerticalEntities)) {
				    this.entityManager.setMovement(this.currentVerticalEntities, "moveY", false);
				}

			    // block the horizontalEntity of the blocked row
				if (this.entityManager.containsHurdle(this.currentHorizontalEntities)) {
				    this.entityManager.setMovement(this.currentHorizontalEntities, "moveX", false);
				}
                /*************************************************************************************************************/
            }

			//touchMoved
			if (ig.input.state('touch') && this.isTouched) {
			    if (this.currentEntity == null) return;

			    if (this.isDragged) {    //드래그 바운딩이 어느 방향으로 할지 정해진 후
			        if (this.isHorizontal) {
			            //currentEntity.pos.x -= lastPos.x - ig.input.mouse.x;
			            for (var i = 0; i < this.currentHorizontalEntities.length; i++) {
			                if (this.currentHorizontalEntities[i] != null) {
			                    if (this.currentHorizontalEntities[i].moveX || this.currentEntity.moveX)
			                        this.currentHorizontalEntities[i].pos.x -= (lastPos.x - ig.input.mouse.x) * ResizeManager.getReal_Current();
			                }
			            }
			            lastPos.x = ig.input.mouse.x;
			        }
			        else {
			            //currentEntity.pos.y -= lastPos.y - ig.input.mouse.y;
			            for (var i = 0; i < this.currentVerticalEntities.length; i++) {
			                if (this.currentVerticalEntities[i] != null) {
			                    if (this.currentVerticalEntities[i].moveY || this.currentEntity.moveY)
			                        this.currentVerticalEntities[i].pos.y -= (lastPos.y - ig.input.mouse.y) * ResizeManager.getReal_Current();
			                }
			            }
			            lastPos.y = ig.input.mouse.y;
			        }
			    }
			    else {
			        if (!((lastPos.x == (ig.input.mouse.x)) && (lastPos.y == (ig.input.mouse.y)))) {//mouse 좌표값이 움직였을 때 시작.
			            this.difPos.x = lastPos.x - ig.input.mouse.x;
			            this.difPos.y = lastPos.y - ig.input.mouse.y;

			            if (this.difPos.x < 0)
			                this.difPos.x = -this.difPos.x;
			            if (this.difPos.y < 0)
			                this.difPos.y = -this.difPos.y;
			            //console.log("difPosX:" + this.difPos.x + " difPosY:" + this.difPos.y);


			            if (this.difPos.x >= 10) {//x축의 차이값이 먼저 발생하였다. 즉, x축으로 바운드 처리 결정.
			                //if(lastPos.x != (ig.input.mouse.x)){//x축의 차이값이 먼저 발생하였다. 즉, x축으로 바운드 처리 결정.
			                //currentEntity.pos.x -= lastPos.x - ig.input.mouse.x;
			                for (var i = 0; i < this.currentHorizontalEntities.length; i++) {
			                    if (this.currentHorizontalEntities[i] != null) {
			                        if (!(this.currentHorizontalEntities[i].moveX || this.currentEntity.moveX))
			                            this.currentHorizontalEntities[i].pos.x -= 3 * this.getOffset(lastPos.x, ig.input.mouse.x);
			                        else
			                            this.currentHorizontalEntities[i].pos.x -= (lastPos.x - ig.input.mouse.x) * ResizeManager.getReal_Current();
			                    }
			                }
			                lastPos.x = ig.input.mouse.x;
			                this.isHorizontal = true;
			                this.isDragged = true;
			            }
			            else if (this.difPos.y >= 10) {//y축의 차이값이 먼저 발생하였다. 즉, y축으로 바운드 처리 결정.
			                //currentEntity.pos.y -= lastPos.y - ig.input.mouse.y;
			                for (var i = 0; i < this.currentVerticalEntities.length; i++) {
			                    if (this.currentVerticalEntities[i] != null) {
			                        if (!(this.currentVerticalEntities[i].moveY || this.currentEntity.moveY))
			                            this.currentVerticalEntities[i].pos.y -= 3 * this.getOffset(lastPos.y, ig.input.mouse.y);
			                        else
			                            this.currentVerticalEntities[i].pos.y -= (lastPos.y - ig.input.mouse.y) * ResizeManager.getReal_Current();
			                    }
			                }
			                lastPos.y = ig.input.mouse.y;
			                this.isHorizontal = false;
			                this.isDragged = true;
			            }
			        }
			    }
			
			}
		    //touchEnd
			
			if (ig.input.released('touch')) {

                /************************************************/
			    //console.log("HERE TO START MOVEMENT");
			    
			    
			    
			    //console.log("HERE TO END MOVEMENT");
		        /************************************************/

			    this.isTouched = false;
			    this.isDragged = false;
			    //All Events
			    if ((this.currentHorizontalEntities[0] == undefined) || (this.currentVerticalEntities[0] == undefined)) return;
			    // To unblock every horizontal, vertical entities whether they were blocked, or not
			    this.entityManager.setMovement(this.currentHorizontalEntities, "moveX", true);
			    this.entityManager.setMovement(this.currentVerticalEntities, "moveY", true);
                
			    if (this.currentEntity == null) return;
			    if (this.isHorizontal) 
			        this.entityManager.stablizeEntities(this.currentHorizontalEntities);
			    
			    else 
			        this.entityManager.stablizeEntities(this.currentVerticalEntities);
			    
			    for (var i = 0; i < ig.game.entities.length; i++) {
			        if (((ig.game.entities[i].pos.x >= 560) || (ig.game.entities[i].pos.x < 0) || (ig.game.entities[i].pos.y >= 560) || (ig.game.entities[i].pos.y < 0)) && (ig.game.entities[i] instanceof Salad)) {
			            ig.game.entities[i].kill();
			        }
			        else {
			            ig.game.entities[i].isInside = true;
			        }
			    }


			    if (!this.currentEntity.blocked)
			        this.currentEntity.updateState('idle');

			    this.currentEntity = null;
			    this.isAfterReleased = true;

			    var salad_entities = this.entityManager.getSaladEntities();

			}
		},



		getOffset: function (x, y) {
		    if (x - y >= 0) return 1;
		    else return -1;
		},
		changeNodEntity: function () {
		    this.nodTimer.reset();
		    var entities = this.entityManager.getSaladEntities();
		    var x = Math.floor(Math.random() * (entities.length));
		    if (!entities[x].blocked) {
		        entities[x].updateState('nod');
		        if (this.nodEntity != null) {
		            if (!this.nodEntity.blocked) {
		                this.nodEntity.updateState('idle');
		            }
		        }
		        this.nodEntity = entities[x];
		    }
		    else {
		        this.changeNodEntity();
		    }
		}

	});

});