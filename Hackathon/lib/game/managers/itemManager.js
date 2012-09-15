
/**
    Managing all Kinds of item.
*/
ig.module(
	'game.managers.itemManager'
)
.requires(
    'game.managers.entityManager',
    'game.managers.popManager2',
    'game.item.clearItem',
    'game.managers.hurdleManager',
    'game.managers.animManager'
)
.defines(function () {
    ItemManager = ig.Class.extend({
        
        count : 0,
        //animManager: null,
        timeManager: null,
        timeCount: 0,
        staticInstantiate: function () {
            if (ItemManager.instance == null) {
                return null;
            }
            else {
                return ItemManager.instance;
            }
        },


        init: function (time) {
            ItemManager.instance = this;
            
            this.timeManager = time;
            //console.log("itemManager's time:" + this.timeManager.leftTime);
        },


        ////////////////////////////////////////////////////////////
        //  setting some certain items
        ///////////////////////////////////////////////////////////
        setItem: function (TYPE, attachedEnt) {
            switch (TYPE) {

                ////////////////////////////////////////////////////////////
                //  Clear every salad which is same type
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.SAME_TYPE:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.SAME_TYPE,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.SAME_TYPE),
                            effect: function () {
                                var salad_entities = new EntityManager().getSaladEntities(this.attachedSalad.saladType);

                                for (var i = 0 ; i < salad_entities.length ; i++) {
                                    if (this.attachedSalad != salad_entities[i]) {
                                        salad_entities[i].setPopCheck(true);
                                        if (salad_entities[i].attachedItem != null) {
                                            salad_entities[i].popCheck = false;
                                            salad_entities[i].isEeing = true;
                                        }
                                    }
                                }
                            }
                        });
                    break;


                ////////////////////////////////////////////////////////////
                //  Clear every salad which is located in horizontal
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.HORIZONTAL:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.HORIZONTAL,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.HORIZONTAL),
                            effect: function () {
                                var salad_entities = new EntityManager().getHorizontalEntities(this.pos.x + 2, this.pos.y + 2);

                                for (var i = 0 ; i < salad_entities.length ; i++) {
                                    if (this.attachedSalad != salad_entities[i]) {
                                        salad_entities[i].setPopCheck(true);
                                        if (salad_entities[i].attachedItem != null) {
                                            //console.log("IN HERE");
                                            salad_entities[i].popCheck = false;
                                            salad_entities[i].isEeing = true;
                                        }
                                    }
                                }
                            }
                        });
                    break;

                ////////////////////////////////////////////////////////////
                //  Clear every salad which is located in vertical
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.VERTICAL:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.VERTICAL,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.VERTICAL),
                            effect: function () {
                                var salad_entities = new EntityManager().getVerticalEntities(this.pos.x + 2, this.pos.y + 2);

                                for (var i = 0 ; i < salad_entities.length ; i++) {
                                    if (this.attachedSalad != salad_entities[i]) {
                                        salad_entities[i].setPopCheck(true);
                                        if (salad_entities[i].attachedItem != null) {
                                            salad_entities[i].popCheck = false;
                                            salad_entities[i].isEeing = true;
                                        }
                                    }
                                }
                            }
                        });
                    break;


                ////////////////////////////////////////////////////////////
                //  Clear every salad which is located in cross side
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.CROSS:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.CROSS,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.CROSS),
                            effect: function () {
                                var entMan = new EntityManager();
                                var salad_entities = entMan.getHorizontalEntities(this.pos.x + 1, this.pos.y + 1);
                                var salad_entities2 = entMan.getVerticalEntities(this.pos.x + 1, this.pos.y + 1);
                                for (var i = 0 ; i < salad_entities.length ; i++) {
                                    if (this.attachedSalad != salad_entities[i]) {
                                        salad_entities[i].setPopCheck(true);
                                        if (salad_entities[i].attachedItem != null) {
                                            salad_entities[i].popCheck = false;
                                            salad_entities[i].isEeing = true;
                                        }
                                    }
                                }
                                for (var i = 0 ; i < salad_entities2.length ; i++) {
                                    if (this.attachedSalad != salad_entities2[i]) {
                                        salad_entities2[i].setPopCheck(true);
                                        if (salad_entities2[i].attachedItem != null) {
                                            salad_entities2[i].popCheck = false;
                                            salad_entities2[i].isEeing = true;
                                        }
                                    }
                                }
                            }
                        });
                    break;

                /*
                ////////////////////////////////////////////////////////////
                //  Clear 3 X 3 near the entity
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.CLEAR_3:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.CLEAR_3,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.CLEAR_3),
                            effect: function () {
                                
                                var entMan = new EntityManager();
                                var entities = new Array();
                                var posX = this.pos.x + 35;
                                var posY = this.pos.y + 35;
                                entities.push(entMan.getSelectedEntity(posX - 70, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY + 70));


                                for (var i = 0 ; i < entities.length ; i++)
                                    entities[i].setPopCheck(true);
                            }
                        });
                    break;
                */


                ////////////////////////////////////////////////////////////
                //  Clear every Iced Salad
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.ICE_CLEAR:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.ICE_CLEAR,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.ICE_CLEAR),
                            effect: function () {

                                var entMan = new EntityManager();
                                var entities = entMan.getSaladEntities();

                                for (var i = 0 ; i < entities.length ; i++) {
                                    if (entities[i].blocked) {
                                        entities[i].blocked = false;
                                        entities[i].updateState('idle');
                                    }
                                }
                            }
                        });
                    break;


                
                ////////////////////////////////////////////////////////////
                //  Add time 5sec.
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.TIME_5:
                case ItemManager.ITEM_TYPE.TIME_5_:
                case ItemManager.ITEM_TYPE.TIME_5__:
                    this.timeCount++;
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.TIME_5,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.TIME_5),
                            time : this.timeManager,
                            effect: function () {

                                this.time.leftTime += 6;

                            }
                        });
                    break;
                

                /////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////
                //////
                //////    SPECIAL ?_ITEM
                //////
                /////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////



                ////////////////////////////////////////////////////////////
                //  Clear 5 X 5 near the entity
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.CLEAR_5:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.CLEAR_5,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.CLEAR_5),
                            effect: function () {

                                var entMan = new EntityManager();
                                var entities = new Array();
                                var posX = this.pos.x + 35;
                                var posY = this.pos.y + 35;

                                entities.push(entMan.getSelectedEntity(posX - 140, posY - 140));
                                entities.push(entMan.getSelectedEntity(posX - 140, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX - 140, posY));
                                entities.push(entMan.getSelectedEntity(posX - 140, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX - 140, posY + 140));

                                entities.push(entMan.getSelectedEntity(posX - 70, posY - 140));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY + 140));

                                entities.push(entMan.getSelectedEntity(posX, posY - 140));
                                entities.push(entMan.getSelectedEntity(posX, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX, posY));
                                entities.push(entMan.getSelectedEntity(posX, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX, posY + 140));

                                entities.push(entMan.getSelectedEntity(posX + 70, posY - 140));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY + 140));

                                entities.push(entMan.getSelectedEntity(posX + 140, posY - 140));
                                entities.push(entMan.getSelectedEntity(posX + 140, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX + 140, posY));
                                entities.push(entMan.getSelectedEntity(posX + 140, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX + 140, posY + 140));


                                for (var i = 0 ; i < entities.length ; i++) {
                                    if (this.attachedSalad != entities[i]) {
                                        entities[i].setPopCheck(true);
                                        if (entities[i].attachedItem != null) {
                                            entities[i].popCheck = false;
                                            entities[i].isEeing = true;
                                        }
                                    }
                                }
                            }
                        });
                    break;



                ////////////////////////////////////////////////////////////
                //  Remove every Walnut
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.WALNUT_REMOVE:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.WALNUT_REMOVE,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.JOKER),
                            effect: function () {

                                var salad_entities = new EntityManager().getSaladEntities('EntityWalnut');

                                for (var i = 0 ; i < salad_entities.length ; i++) {
                                    if (this.attachedSalad != salad_entities[i]) {
                                        salad_entities[i].popCheck = true;
                                        if (salad_entities[i].attachedItem != null) {
                                            salad_entities[i].popCheck = false;
                                            salad_entities[i].isEeing = true;
                                        }
                                    }
                                }
                                


                            }
                        });
                    break;



                ////////////////////////////////////////////////////////////
                //  Make the Entity JOKER
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.JOKER:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.JOKER,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.JOKER),
                            killCount: 0,
                            time: this.timeManager,
                            effect: function () {
                                //this.time.leftTime += 5;
                                
                                this.attachedSalad.saladType = 'EntityJoker';
                                this.attachedSalad.animSheet = new AnimManager().getSaladAnim('EntityJoker');
                                this.attachedSalad.addAnim('idle', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
                                this.attachedSalad.addAnim('nod', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
                                this.attachedSalad.addAnim('touch', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
                                this.attachedSalad.addAnim('kill', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
                                this.attachedSalad.addAnim('blocking', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
                                this.attachedSalad.addAnim('blocked', 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                                this.attachedSalad.currentAnim = this.attachedSalad.anims.idle;

                                this.attachedSalad.popCheck = false;

                                this.killCount++;
                                if (this.killCount == 1)
                                    this.kill();
                                if (this.killCount == 10) {
                                    this.attachedSalad.popCheck = true;
                                }

                            },
                            setPopCheck: function (bool) {
                                this.popCheck = false;
                            }
                        });
                    break;

                ////////////////////////////////////////////////////////////
                //  ICE 3 X 3 near the entity
                ///////////////////////////////////////////////////////////
                case ItemManager.ITEM_TYPE.ICE_3:
                    ig.game.spawnEntity(ClearItem, attachedEnt.pos.x, attachedEnt.pos.y,
                        {
                            attachedSalad: attachedEnt,
                            itemType: ItemManager.ITEM_TYPE.ICE_3,
                            animSheet: new AnimManager().getItemAnim(ItemManager.ITEM_TYPE.ICE_3),
                            effect: function () {
                                var entMan = new EntityManager();
                                var entities = new Array();
                                var posX = this.pos.x + 35;
                                var posY = this.pos.y + 35;
                                entities.push(entMan.getSelectedEntity(posX - 70, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY));
                                entities.push(entMan.getSelectedEntity(posX - 70, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX, posY + 70));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY - 70));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY));
                                entities.push(entMan.getSelectedEntity(posX + 70, posY + 70));

                                var hurdleArray = new Array();
                                for (var i = 0 ; i < entities.length ; i++) {
                                    hurdleArray.push(new HurdleManager());
                                }
                                for (var i = 0 ; i < entities.length ; i++) {
                                    hurdleArray[i].makeEntityIce(entities[i]);
                                }
                            }


                        });
                    break;


                default:
                    console.log("DEFAULT");
                    break;
            }
        },

        makeItem: function (specialType) {
            var entMan = new EntityManager();
            var TYPE_NUM;
            var x = (Math.floor(Math.random() * 1000)) % entMan.getSaladEntities().length;
            var attSal = entMan.getSaladEntities()[x];

            if (specialType == undefined) {
                var mod_num = 4;
                if(this.timeManager != null)
                if ((this.timeManager.leftTime < 40) && (this.timeCount < 10)) {
                    mod_num = 6;
                    //console.log("IN TIMER : " + this.timeCount);
                }
                else if ((this.timeManager.leftTime < 20) && (this.timeCount < 10)) {
                    mod_num = 7;
                }
                TYPE_NUM = (Math.floor(Math.random() * 1000)) % mod_num;
                
            }
            else {
                console.log("IN ?");
                var mod_num = 3;
                if (entMan.getSaladEntities('EntityWalnut').length > 0) mod_num = 4;
                TYPE_NUM = (Math.floor(Math.random() * 1000)) % mod_num + 7;
            }
            //TYPE_NUM = (Math.floor(Math.random() * 1000)) % 4;
            //TYPE_NUM = 5;
            //console.log(TYPE_NUM);
            if ((attSal.attachedItem == null) && attSal.saladType != 'EntityWalnut'){
                this.setItem(TYPE_NUM, attSal);

            }
            else {
                this.makeItem(specialType);
            }

        },

        testClearItem: function () {

            if (new EntityManager().getItemEntities().length < 3) {
                this.makeItem();
            }

        }
    });
    

    ////////////////////////////////////////////////////////////
    //  Enum for item type 
    ///////////////////////////////////////////////////////////
    ItemManager.ITEM_TYPE = {
        SAME_TYPE: 0,
        HORIZONTAL: 1,
        VERTICAL: 2,
        CROSS: 3,
        //CLEAR_3: 4,
        //ICE_CLEAR: 4,
        TIME_5: 4,
        TIME_5_: 5,
        TIME_5__: 6,
        ////////////////////
        ////////////////////

        CLEAR_5: 7,
        JOKER: 8,
        ICE_3: 9,
        WALNUT_REMOVE: 10,
        //ICE_CLEAR: 11

    }


    ItemManager.ITEM_TYPE.length = function () {
        var ENUM_LENGTH = 0;
        for (var i in ItemManager.ITEM_TYPE)
            ENUM_LENGTH++;
        return ENUM_LENGTH;
    }


    ItemManager.instance = null;
});