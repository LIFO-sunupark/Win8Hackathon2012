ig.module(
	'game.entities.salad'
)
.requires(
	'impact.entity',
    'game.managers.entityManager'
)
.defines(function () {

    /*
    Before refactoring - we made each entity class for identifying each salaad(cheese, egg, etc.)
    After  refactoring - we only use Salad class and identify each salad by saladType and other properties.
    */

	Salad = ig.Entity.extend({
		//set properties of entity
		
		size: {x: 68, y: 68},
		//type
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		//type of salad
		/**************************/
		saladType: 'Salad',
		isInside: true,
		isFalling: false,
		blocked: false,
		move: true,
		moveX: true,
		moveY: true,
        sameY: true,
        animSheet: null,
        destY: 0,   //when it is necessary to move entities, it helps entities to know destination y value.

        attachedItem: null,

        targetY: -1,
        speed: 1,
        moveFlag: false,

        popCheck: false,
        isEeing: false,

        /****************************/
        init: function (x, y, settings) {
            
		    this.parent(x, y, settings);

            // this.parent() method will set the animSheet value. So this.addAnim() method will operate properly.
            /********************************/
		    if (this.saladType == 'EntityJoker') {
		        this.addAnim('idle', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
		        this.addAnim('nod', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
		        this.addAnim('touch', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
		        this.addAnim('kill', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
		        this.addAnim('blocking', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
		        this.addAnim('blocked', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
		    }
		    else {
		        this.addAnim('idle', 1, [0]);
		        this.addAnim('nod', 0.3, [1, 2, 3, 2]);
		        this.addAnim('touch', 0.5, [4, 5]);
		        this.addAnim('kill', 0.1, [11, 12, 13, 14, 15]);
		        this.addAnim('blocking', 0.5, [7, 8, 9, 10]);
		        this.addAnim('blocked', 1, [10]);
		        this.addAnim('eeing', 0.05, [17,18,19,20]);
		    }
            /********************************/
		},
		update: function () {

		    if (this.moveFlag == true) {
		        this.pos.y += 1 * this.speed;

		        if ((this.targetY == this.pos.y))
		            this.moveFlag = false;
		    }
		    if (this.isEeing) this.currentAnim = this.anims.eeing;
		    if ((!this.saladType == 'EntityJoker') && this.currentAnim == this.anims.idle) return;
            
		    this.parent();
		},
		moveEntity: function (toY, speed) {
		    this.moveFlag = true;
		    this.targetY = toY;
		    this.speed = speed;
		},


	    /***************************************************/
	    // Switch the method name from update() to updateState() because of duplicated named method.
        // we found out that javascript does not support overloading.
		updateState: function (state) {
		    if (state == 'touch') {
		        this.currentAnim = this.anims.touch;
		    }
		    else if (state == 'idle') {
		        this.currentAnim = this.anims.idle;
		    }
		    else if (state == 'kill') {
		        this.currentAnim = this.anims.kill;
		    }
		    else if (state == 'blocking') {
		        this.currentAnim = this.anims.blocking;
		    }
		    else if (state == 'blocked') {
		        this.currentAnim = this.anims.blocked;
		    }
		    else if (state == 'nod') {
		        this.currentAnim = this.anims.nod;
		    }
		    else if (state == 'eeing') {
		        this.currentAnim = this.anims.eeing;
		    }
		},


		kill: function () {

		    if (this.attachedItem != null) {
		        this.attachedItem.kill();
		        this.attachedItem = null;
		    }

		    this.parent();
		    
		},

		setPopCheck: function (bool) {
		    this.popCheck = bool;
		},


		activateAttachedItem: function () {
		    if (this.attachedItem != null) {
		        this.attachedItem.effect();
		        score += 1000;
		        addScore(score);
		    }

		}
	});
});