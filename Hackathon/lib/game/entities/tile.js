ig.module(
	'game.entities.tile'
)
.requires(
	'impact.entity'
)
.defines(function () {
    // The Collectable Coin Entity
    EntityTile = ig.Entity.extend({
        size: { x: 8, y: 8 },
        animSheet: new ig.AnimationSheet('media/tiles.png', 4, 4),
        type: ig.Entity.TYPE.B,

        //sound: new ig.Sound('media/coin.ogg'),

        init: function (x, y, settings) {
            this.addAnim('idle', 0.1, [0, 1]);
            this.parent(x, y, settings);
        },

        update: function () {
            this.parent();
            if (this.pos.y - ig.game.screen.y < -32) {
                this.kill();
            }
        }
    });
});