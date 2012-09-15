ig.module(
	'game.managers.animManager'
)
.requires(
    'impact.entity',
    'game.managers.geometryManager'
)
.defines(function () {
    AnimManager = ig.Class.extend({

        //////////////////////////////////////
        // Salad animations
        /////////////////////////////////////
        tomato: null,
        paprika: null,
        eggplant: null,
        kiwi: null,
        onion: null,
        orange: null,
        egg: null,
        cheese: null,

        walnut: null,

        joker: null,

        question: null,

        /////////////////////////////////////
        // Item animations
        /////////////////////////////////////
        clearSameType: null,
        clearHorizontal: null,
        clearVertical: null,
        clearCross: null,
        clear3: null,
        clear5: null,
        ice3: null,
        clearIce: null,
        time_5: null,

        
        staticInstantiate: function () {
            if (AnimManager.instance == null) {
                return null;
            }
            else {
                return AnimManager.instance;
            }
        },



        init: function () {
            AnimManager.instance = this;

            this.tomato = new ig.AnimationSheet('media/tomato.png', 70, 70);
            this.paprika = new ig.AnimationSheet('media/paprika.png', 70, 70);
            this.eggplant = new ig.AnimationSheet('media/eggplant.png', 70, 70);
            this.kiwi = new ig.AnimationSheet('media/kiwi.png', 70, 70);
            this.onion = new ig.AnimationSheet('media/onion.png', 70, 70);
            this.orange = new ig.AnimationSheet('media/orange.png', 70, 70);
            this.egg = new ig.AnimationSheet('media/egg.png', 70, 70);
            this.cheese = new ig.AnimationSheet('media/cheese.png', 70, 70);

            this.walnut = new ig.AnimationSheet('media/walnut.png', 70, 70);

            this.joker = new ig.AnimationSheet('media/joker.png', 70, 70);
            //this.joker = new ig.AnimationSheet('media/cheese.png', 70, 70);

            this.clearSameType = new ig.AnimationSheet('media/item_same_clear.png', 70, 70);
            this.clearHorizontal = new ig.AnimationSheet('media/item_horizontal.png', 70, 70);
            this.clearVertical = new ig.AnimationSheet('media/item_vertical.png', 70, 70);
            this.clearCross = new ig.AnimationSheet('media/item_cross_clear.png', 70, 70);
            this.clear3 = new ig.AnimationSheet('media/item_clear_3.png', 70, 70);
            this.clear5 = new ig.AnimationSheet('media/item_quetion_mark.png', 70, 70);
            this.ice3 = new ig.AnimationSheet('media/item_quetion_mark.png', 70, 70);
            this.clearIce = new ig.AnimationSheet('media/item_quetion_mark.png', 70, 70);
            this.time_5 = new ig.AnimationSheet('media/item_time+5.png', 70, 70);

            this.question = new ig.AnimationSheet('media/item_quetion_mark.png', 70, 70);
        },


        getSaladAnim: function (saladType) {
            switch (saladType) {
                case 'EntityTomato': return this.tomato;
                case 'EntityParika': return this.paprika;
                case 'EntityEggplant': return this.eggplant;
                case 'EntityKiwi': return this.kiwi;
                case 'EntityOnion': return this.onion;
                case 'EntityOrange': return this.orange;
                case 'EntityEgg': return this.egg;
                case 'EntityCheese': return this.cheese;

                case 'EntityWalnut': return this.walnut;

                case 'EntityJoker': return this.joker;

                default: return null;
            }
        },


        getItemAnim: function (itemType) {
            switch (itemType) {
                case ItemManager.ITEM_TYPE.SAME_TYPE: return this.clearSameType;
                case ItemManager.ITEM_TYPE.HORIZONTAL: return this.clearHorizontal;
                case ItemManager.ITEM_TYPE.VERTICAL: return this.clearVertical;
                case ItemManager.ITEM_TYPE.CROSS: return this.clearCross;
                case ItemManager.ITEM_TYPE.CLEAR_3: return this.clear3;
                case ItemManager.ITEM_TYPE.CLEAR_5: return this.clear5;
                case ItemManager.ITEM_TYPE.ICE_3: return this.ice3;
                case ItemManager.ITEM_TYPE.ICE_CLEAR: return this.clearIce;
                case ItemManager.ITEM_TYPE.TIME_5: return this.time_5;
                case ItemManager.ITEM_TYPE.JOKER: return this.question;

                default: return null;
            }
        }
    });

    AnimManager.instance = null
});