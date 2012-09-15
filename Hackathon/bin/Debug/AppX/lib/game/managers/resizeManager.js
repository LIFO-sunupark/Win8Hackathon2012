ig.module(
		'game.managers.resizeManager'
)
.requires(
		'impact.entity', 
		'game.managers.geometryManager'
)
.defines(function(){
	ResizeManager = ig.Class.extend({
		init: function() {
			this.resizeGame();		
			window.addEventListener('resize', this.resizeGame, false);
			//window.addEventListener('orientationchange', resizeGame, false);
		},
		resizeGame: function() {
		    var canvas = document.getElementById('gameCanvas');
		    if (!canvas) {
		        return;
		    }
			var widthToHeight = 1;
			var newWidth = window.innerWidth;
			var newHeight = window.innerHeight;
			var newWidthToHeight = newWidth / newHeight;

			if (newWidthToHeight > widthToHeight) {
				newWidth = newHeight * widthToHeight;
				canvas.style.height = newHeight + 'px';
			    canvas.style.width = newWidth + 'px';
			} else {
				newHeight = newWidth / widthToHeight;
				canvas.style.width = newWidth + 'px';
			    canvas.style.height = newHeight + 'px';
			}
		}
	});
	//static methods of resizeManager
	ResizeManager.getCurrent_Real = function(){
		var canvas = document.getElementById('gameCanvas');
		var widthToHeight = 1;
        
		var newWidth = window.innerWidth;
		//return 1;
		var newHeight = window.innerHeight;
		var newWidthToHeight = newWidth / newHeight;

		if (newWidthToHeight > widthToHeight) {
			newWidth = newHeight * widthToHeight;
		} else {
			newHeight = newWidth / widthToHeight;
		}
		//console.log("newWidth " + newWidth);
	    return newWidth / 560;
		//return newWidth / 700;
	};
	
	ResizeManager.getReal_Current = function(){
		var canvas = document.getElementById('gameCanvas');
		var widthToHeight = 1;
		var newWidth = window.innerWidth;
		//return 1;
		var newHeight = window.innerHeight;
		var newWidthToHeight = newWidth / newHeight;

		if (newWidthToHeight > widthToHeight) {
			newWidth = newHeight * widthToHeight;
		} else {
			newHeight = newWidth / widthToHeight;
		}
		//console.log("newWidth " + newWidth);
	    return 560 / newWidth;
		//return 700 / newWidth;
	}

});