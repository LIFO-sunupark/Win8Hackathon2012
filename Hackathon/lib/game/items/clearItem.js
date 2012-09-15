/*
  Base class for item classes
*/
ig.module(
	'game.item.clearItem'
)
.requires(
    'impact.entity',
    'game.managers.entityManager',
    'game.managers.popManager2'
)
.defines(function () {
    ClearItem = ig.Entity.extend({

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,
        //size : {x : 16, y : 28},
        size: { x: 70, y: 70 },
        attachedSalad: null,
        //animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
        isInside: false,

        itemType: 'clear',
        anim: null,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.anim = this.addAnim('create', 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], true);
            this.addAnim('idle', 0.1, [12,13, 14, 15, 16, 17, 18,19]);
            this.currentAnim = this.anims.create;
            settings.attachedSalad.attachedItem = this;
        },


        update: function () {
            if(this.anim.tile == 11) this.currentAnim = this.anims.idle
            if (this.attachedSalad != null) {
                this.pos.x = this.attachedSalad.pos.x;
                this.pos.y = this.attachedSalad.pos.y;
            }
            //if (this.currentAnim == this.anims.idle) return;

            this.parent();
        },

        //////////////////////////////////
        // hook method, this function will be called when item gets killed
        /////////////////////////////////
        effect: null
    });
});