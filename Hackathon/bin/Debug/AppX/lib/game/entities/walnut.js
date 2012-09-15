ig.module(
	'game.entities.walnut'
)
.requires(
	'impact.entity',
    'game.managers.entityManager',
   'game.entities.salad'
)
.defines(function () {

    Walnut = Salad.extend({
        /********Salad Property************/
        //set properties of entity
        
        size: { x: 68, y: 68 },
        //type
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,
        //type of salad
        
        saladType: 'EntityWalnut',
        isInside: true,
        isFalling: false,
        blocked: false,
        move: true,
        moveX: true,
        moveY: true,
        sameY: true,
        //animSheet: new ig.AnimationSheet('media/walnut.png', 70, 70),
        destY: 0,   //when it is necessary to move entities, it helps entities to know destination y value.

        attachedItem: null,

        targetY: -1,
        speed: 1,
        moveFlag: false,

        popCheck: false,
        
        /*******************************/


        init: function (x, y, settings) {

            this.parent(x, y, settings);

            // this.parent() method will set the animSheet value. So this.addAnim() method will operate properly.
            /********************************/
            this.addAnim('idle', 1, [0]);
            this.addAnim('nod', 1, [0]);
            this.addAnim('touch', 1, [0]);
            this.addAnim('kill', 0.1, [11, 12, 13, 14, 15]);
            this.addAnim('blocking', 1, [0]);
            this.addAnim('blocked', 1, [0]);
            /********************************/
            this.currentAnim = this.anims.idle;
        },
        update: function () {
            if (this.moveFlag == true) {
                this.pos.y += 1 * this.speed;

                if ((this.targetY == this.pos.y))
                    this.moveFlag = false;
            }
            if (this.currentAnim == this.anims.idle) return;

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
            /*
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
            }*/
            if (state == 'idle') {
                this.currentAnim = this.anims.idle;
            }
            else if (state == 'kill') {
                this.currentAnim = this.anims.kill;
            }
            console.log(this.currentAnim == this.anims.idle);
            //ig.game.toString(this.currentAnim);
        },


        kill: function () {
            /*
            if (this.attachedItem != null) {
                this.attachedItem.kill();
                this.attachedItem = null;
            }
            */
            this.parent();

        },

        setPopCheck: function (bool) {
            this.popCheck = false;
        }
    });
});