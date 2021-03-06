ig.module(
	'drop'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.collision-map',
	'impact.background-map',
	'impact.font',
    'game.entities.player',
    'game.entities.coin'
)
.defines(function(){
	
// The Backdrop image for the game, subclassed from ig.Image
// because it needs to be drawn in it's natural, unscaled size, 
FullsizeBackdrop = ig.Image.extend({
	resize: function(){},
	draw: function() {
		if( !this.loaded ) { return; }
		ig.system.context.drawImage( this.data, 0, 0 );
	}
});

// A Custom Loader for the game, that, after all images have been
// loaded, goes through them and "pixifies" them to create the LCD
// effect.
DropLoader = ig.Loader.extend({
	end: function() {
		for( i in ig.Image.cache ) {
			var img = ig.Image.cache[i];
			if( !(img instanceof FullsizeBackdrop) ) {
				this.pixify( img, ig.system.scale );
			}
		}
		this.parent();
	},
	
	
	// This essentially deletes the last row and collumn of pixels for each
	// upscaled pixel.
	pixify: function( img, s ) {
		var ctx = img.data.getContext('2d');
		var px = ctx.getImageData(0, 0, img.data.width, img.data.height);
		
		for( var y = 0; y < img.data.height; y++ ) {
			for( var x = 0; x < img.data.width; x++ ) {
				var index = (y * img.data.width + x) * 4;
				var alpha = (x % s == 0 || y % s == 0) ? 0 : 0.9;
				px.data[index + 3] = px.data[index + 3] * alpha;
			}
		}
		ctx.putImageData( px, 0, 0 );
	}
});


// The actual Game Source
DropGame = ig.Game.extend({
	clearColor: null, // don't clear the screen
	gravity: 240,
	player: null,
		
	map: [],
	score: 0,
	speed: 1,
	depth: 0,

	tiles: new ig.Image( 'media/tiles.png' ),
	backdrop: new FullsizeBackdrop( 'media/backdrop.png' ),
	font: new ig.Font( 'media/04b03.font.png' ),
	gameOverSound: new ig.Sound( 'media/gameover.ogg' ),
	
	init: function() {
		// uncomment this next line for more authentic (choppy) scrolling
		//ig.system.smoothPositioning = false; 
		
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind(ig.KEY.UP_ARROW, 'jump');
		ig.input.bind(ig.KEY.ENTER, 'ok');
		
		// The first part of the map is always the same
		this.map = [
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,1,1,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
		];
		
		// Now randomly generate the remaining rows
		for( var y = 8; y < 18; y++ ) {	
		    if (y % 2 == 0) {
		        this.map[y] = this.getRow();
		    }
		    else {
                this.map[y] = this.getEmptyRow();
		    }
		    
		}
		
		// The map is used as CollisionMap AND BackgroundMap
		this.collisionMap = new ig.CollisionMap( 8, this.map );
		this.backgroundMaps.push( new ig.BackgroundMap(8, this.map, 'media/tiles.png' ) );
		
		this.player = this.spawnEntity( EntityPlayer, ig.system.width/2-2, 24 );
	},
	
	getEmptyRow: function() {
	    var row = [];
	    for (var x = 0; x < 8; x++) {
	        row[x] = 0;
	    }
	    return row;
	},
	
	getRow: function() {
		// Randomly generate a row of block for the map. This is a naive approach,
		// that sometimes leaves the player hanging with no block to jump to. It's
		// random after all.
	    var row = [];
	    var emptySpace = Math.floor((Math.random() * 8));
		for( var x = 0; x < 8; x++ ) {
			row[x] = Math.random() > 0.5 ? 1 : 0;
		}
		row[emptySpace] = 0;
		return row;
	},
	
	
	placeCoin: function() {
		// Randomly find a free spot for the coin, max 12 tries
		for( var i = 0; i < 12; i++ ) {
			var tile = (Math.random() * 8).ceil();
			if(
				this.map[this.map.length-2][tile] &&
				!this.map[this.map.length-1][tile]
			) {
				var y = (this.map.length-2) * 8;
				var x = tile * 8 + 1;
				this.spawnEntity( EntityCoin, x, y );
				return;
			}
		}
	},
	
	
	update: function() {
		if( ig.input.pressed('ok') ) {
			ig.system.setGame( DropGame );
		}
			
		if( this.gameOver ) {
			return;
		}
		
		this.speed += ig.system.tick * (10/this.speed);
		this.screen.y += ig.system.tick * this.speed;
		//this.score += ig.system.tick * this.speed*10;
		//this.depth += ig.system.tick * this.speed * 5;
		// Do we need a new row?
		if( this.screen.y > 40 ) {
			
			// Move screen and entities one tile up
		    this.screen.y -= 16;

			for( var i =0; i < this.entities.length; i++ ) {
			    this.entities[i].pos.y -= 16;
			}
			this.player.lastPosY--;
			//this.player.updatePosCnt++;
			// Delete first row, insert new
			this.map.shift();
			this.map.shift();
			this.map.push(this.getRow());
			this.map.push(this.getEmptyRow());
			
			// Place coin?
			if( Math.random() > 0.5 ) {
				this.placeCoin();
			}
		}
		this.parent();
		if (this.player.lastPosY == 0) {
		    this.player.lastPosY = Math.round(this.player.pos.y / 16);
		}
		if (this.player.lastPosY != Math.round(this.player.pos.y / 16)) {
		    this.score += 10;
		    this.depth += 10;
		    this.player.lastPosY=Math.round(this.player.pos.y/16);
		    if(this.depth%200==0&&this.depth!=0) {
		        CURRENT_DEPTH=this.depth;
		        speedUpBGM();
		    }
		}
		// check for gameover
		var pp = this.player.pos.y - this.screen.y;
		if( pp > ig.system.height + 8 || pp < -32 ) {
			this.gameOver = true;
			this.gameOverSound.play();
			showPopup(this.score.floor().toString(), this.depth.floor().toString());
			resetBGMSpeed();
		}
		
	},
	
	
	draw: function() {
		this.backdrop.draw();
		
		if( this.gameOver ) {
			this.font.draw( 'Game Over!', ig.system.width/2, 32, ig.Font.ALIGN.CENTER );
			this.font.draw( 'Press Enter', ig.system.width/2, 48, ig.Font.ALIGN.CENTER );
			this.font.draw( 'to Restart',ig.system.width/2,56,ig.Font.ALIGN.CENTER);
		}
		else {
			this.parent();
		}
		
		updateScore(this.score.floor().toString());
		updateDepth(this.depth.floor().toString());
	}
});

});