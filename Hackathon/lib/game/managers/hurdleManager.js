ig.module( 
	'game.managers.hurdleManager' 
)
.requires(
    'game.managers.entityManager'
)
.defines(function(){
	HurdleManager = ig.Class.extend({
		freezeTimer: null,
		doFreeze: false,
		frozenEntity: null,
        entityManager: null,

		init: function(){
		    this.freezeTimer = new ig.Timer(1);
		    this.entityManager = new EntityManager();
		},
		
		makeIce: function (num) {
		    var entities = this.entityManager.getSaladEntities();
		    var x = Math.floor(Math.random() * (entities.length));
			for(var i = 0; i < num; i++){
			    if (!entities[x].blocked) {
			        this.frozenEntity = entities[x];
					this.frozenEntity.blocked = true;
					this.frozenEntity.updateState('blocking');
					this.freezeTimer.reset();
					this.doFreeze = true;
				}
				else{
					this.makeIce(num);
				}
			}
		},

		makeEntityIce: function(entity){
		    if (!entity.blocked) {
		        this.frozenEntity = entity;
		        this.frozenEntity.blocked = true;
		        this.frozenEntity.updateState('blocked');
		        //this.freezeTimer.reset();
		        //this.doFreeze = true;
		    }
		    
		},
		
		update: function () {

			if(this.doFreeze){
				if(this.freezeTimer.delta() > 0){
					this.doFreeze = false;
					this.frozenEntity.updateState('blocked');
				}
			}
		}
	});
});