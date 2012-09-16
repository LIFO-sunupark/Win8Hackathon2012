ig.module(
	'game.entities.coin'
)
.requires(
	'impact.entity'
)
.defines(function () {
    // The Collectable Coin Entity
    EntityCoin = ig.Entity.extend({
        size: { x: 6, y: 6 },
        offset: { x: -1, y: -1 },
        animSheet: new ig.AnimationSheet('media/coin.png', 4, 4),
        type: ig.Entity.TYPE.B,

        sound: new ig.Sound('media/coin.ogg'),

        init: function (x, y, settings) {
            this.addAnim('idle', 0.1, [0, 1]);
            this.parent(x, y, settings);
        },

        update: function () {
            this.parent();
            if (this.pos.y - ig.game.screen.y < -32) {
                this.kill();
            }
        },

        pickup: function () {
            ig.game.score += 500;
            this.sound.play();
            this.kill();
        }
    });
});