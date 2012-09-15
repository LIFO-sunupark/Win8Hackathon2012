/**
    Managing Entities
*/
ig.module(
	'game.managers.entityManager'
)
.requires(
    'impact.entity',
    'game.managers.geometryManager'
)
.defines(function () {
    EntityManager = ig.Class.extend({
        
        currentEntity: null,
        verticalEntities: null,
        horizontalEntities: null,

        //itemManager: null,

        //////////////////////////////////////////
        _hookMethod: null,   // using hook method.
        //////////////////////////////////////////

        staticInstantiate: function() {
            if( EntityManager.instance == null ) {
                return null;
            }
            else {
                return EntityManager.instance;
            }
        },
    

        init: function(  ) {
            EntityManager.instance = this;
            //this.itemManager = new ItemManager();
        },



        ////////////////////////////////////////////////////////
        // 맵에 있는 모든 엔티티 중에 salad type 엔티티만 반환  
        ////////////////////////////////////////////////////////
        getSaladEntities: function (type) {
            var flag = false;
            if (type == undefined)
                flag = true;

            var arr = new Array();
            for (var i = 0 ; i < ig.game.entities.length ; i++) {
                if ( (ig.game.entities[i] instanceof Salad) && (ig.game.entities[i].type == ig.Entity.TYPE.NONE) && (flag || ig.game.entities[i].saladType == type))
                    arr.push(ig.game.entities[i]);
            }
            return arr;
        },


        ////////////////////////////////////////////////////////
        // 맵에 있는 모든 엔티티 중에 item 엔티티만 반환
        ////////////////////////////////////////////////////////
        getItemEntities: function () {
            var arr = new Array();
            for (var i = 0 ; i < ig.game.entities.length ; i++) {
                if (ig.game.entities[i] instanceof ClearItem)
                    arr.push(ig.game.entities[i]);
            }
            return arr;
        },


        ////////////////////////////////////////////////////////
        // private method
        ////////////////////////////////////////////////////////
        _updateEntities: function (mousePointX, mousePointY) {

            var entities = this.getSaladEntities();
            //var entities = ig.game.entities;
            for (var i = 0; i < entities.length; i++) {	//현재 마우스 포인트가 어느 엔티티인지 파악하자.
                var thisEntity = entities[i];
                var realX = entities[i].pos.x;
                var realY = entities[i].pos.y;
                var minX = realX * ResizeManager.getCurrent_Real();
                var minY = realY * ResizeManager.getCurrent_Real();
                var maxX = (realX + 70) * ResizeManager.getCurrent_Real();
                var maxY = (realY + 70) * ResizeManager.getCurrent_Real();
                
                // method for hooking
                this._hookMethod(i, realX, realY, minX, minY, maxX, maxY, entities);

            }
        },


        ////////////////////////////////////////////////////////
        // 현재 마우스로 찍은 entity 반환
        ////////////////////////////////////////////////////////
        getSelectedEntity: function (mousePointX, mousePointY) {

            
            // implementing hook method FOR finding current entity
            this._hookMethod = function (i, realX, realY, minX, minY, maxX, maxY, entities) {
                
                if (((minX < mousePointX) && (maxX > mousePointX)) && ((minY < mousePointY) && (maxY > mousePointY))) {	//현재 마우스 클릭을 한 엔티티
                    this.currentEntity = entities[i];
                }

            }
            ////////////////////////////////////////////////////////

            this._updateEntities(mousePointX, mousePointY);
            return this.currentEntity;
            
        },


        ////////////////////////////////////////////////////////
        // 안보이는 곳에 엔티티 추가
        ////////////////////////////////////////////////////////
        /*
        addHidingEntities: function (mousePointX, mousePointY) {


            // implementing hook method FOR adding entities outside the map.
            this._hookMethod = function (i, realX, realY, minX, minY, maxX, maxY, entities) {

                var thisEntity = entities[i];
                if (((minX < mousePointX) && (maxX > mousePointX))) {	//현재 마우스 클릭을 한 엔티티의 세로축에 있는 모든 엔티티
                    var en = ig.game.spawnEntity(Salad, realX, realY + 560, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
                    en.isInside = false;
                    /////////////////////////////////////////////////////
                    if (thisEntity.attachedItem != null)
                        this.itemManager.setItem(thisEntity.attachedItem.itemType, en);
                    /////////////////////////////////////////////////////
                    if ((maxY >= mousePointY))
                        en.pos.y = realY - 560;
                }
                if (((minY < mousePointY) && (maxY > mousePointY))) {	//현재 마우스 클릭을 한 엔티티의 가로축에 있는 모든 엔티티
                     var en = ig.game.spawnEntity(Salad, realX + 560, realY, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
                     en.isInside = false;
                     /////////////////////////////////////////////////////
                     if (thisEntity.attachedItem != null)
                         this.itemManager.setItem(thisEntity.attachedItem.itemType, en);
                     /////////////////////////////////////////////////////
                    if ((maxX >= mousePointX))
                        en.pos.x = realX - 560;
                }
                if ((minX < mousePointX) && (maxX > mousePointX) && (minY < mousePointY) && (maxY > mousePointY)) {
                    var en = ig.game.spawnEntity(Salad, realX, realY + 560, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
                    var en2 = ig.game.spawnEntity(Salad, realX + 560, realY, { saladType: thisEntity.saladType, animSheet: thisEntity.animSheet });
                    en.isInside = false;
                    en2.isInside = false;
                    /////////////////////////////////////////////////////
                    if (thisEntity.attachedItem != null) {
                        this.itemManager.setItem(thisEntity.attachedItem.itemType, en);
                        this.itemManager.setItem(thisEntity.attachedItem.itemType, en2);
                    }
                    /////////////////////////////////////////////////////
                }

            }
            ////////////////////////////////////////////////////////

            this._updateEntities(mousePointX, mousePointY);

        },
        */

        ////////////////////////////////////////////////////////
        // 세로줄 엔티티 반환
        ////////////////////////////////////////////////////////
        getVerticalEntities: function (mousePointX, mousePointY) {

            this.verticalEntities = new Array();

            
            // implementing hook method FOR finding vertical entities.
            this._hookMethod = function (i, realX, realY, minX, minY, maxX, maxY, entities) {
                
                if (((minX < mousePointX) && (maxX > mousePointX))) {	//현재 마우스 클릭을 한 엔티티의 세로축에 있는 모든 엔티티
                    this.verticalEntities.push(entities[i]);
                }

            }
            ////////////////////////////////////////////////////////

            this._updateEntities(mousePointX, mousePointY);
            return this.verticalEntities;
        },


        ////////////////////////////////////////////////////////
        // 가로줄 엔티티 반환
        ////////////////////////////////////////////////////////
        getHorizontalEntities: function (mousePointX, mousePointY) {

            this.horizontalEntities = new Array();

            
            // implementing hook method FOR finding horizontal entities.
            this._hookMethod = function (i, realX, realY, minX, minY, maxX, maxY, entities) {
                
                if (((minY < mousePointY) && (maxY > mousePointY))) {	//현재 마우스 클릭을 한 엔티티의 가로축에 있는 모든 엔티티
                    this.horizontalEntities.push(entities[i]);
                }

            }
            ////////////////////////////////////////////////////////

            this._updateEntities(mousePointX, mousePointY);
            return this.horizontalEntities;

        },


        ////////////////////////////////////////////////////////
        // 해당 줄에 block된 엔티티가 있는지 확인
        ////////////////////////////////////////////////////////
        containsHurdle: function (entities) {
            for (var i = 0 ; i < entities.length ; i++) {
                if (entities[i].blocked) {
                    return true;
                }
            }
            return false;
        },


        ////////////////////////////////////////////////////////
        // 해당 줄의 move 상태를 setting
        ////////////////////////////////////////////////////////
        setMovement: function (entities, dir, bool_type) {
            var moveDir = new String(dir);
            for (var i = 0 ; i < entities.length ; i++) {
                entities[i][moveDir] = bool_type;
            }
        },


        ////////////////////////////////////////////////////////
        // 해당 줄의 stablization
        ////////////////////////////////////////////////////////
        stablizeEntities: function (entities) {
            for (var i = 0; i < entities.length; i++) {
                if (entities[i] != null) {
                    var posOfCurrentEntity = entities[i].pos;
                    var point = LIFORect.ConvertFromRealPointToGridPoint(posOfCurrentEntity.x, posOfCurrentEntity.y);
                    point = LIFORect.ConvertFromGridPointToRealPoint(point.x, point.y);
                    entities[i].pos.x = point.x;
                    entities[i].pos.y = point.y;
                }
            }
        }
    });
    EntityManager.instance = null
});