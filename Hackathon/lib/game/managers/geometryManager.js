ig.module(
		'game.managers.geometryManager'
)
.requires(
)
.defines(function () {
    ////////////////////////////////////////
    //
    // Create a new class 'LIFOSize'
    //
    ////////////////////////////////////////
    LIFOSize = ig.Class.extend({
        width: 0,
        height: 0,

        //Constructor
        init: function (width, height) {
            this.width = width;
            this.height = height;
        }

    });


    ////////////////////////////////////////
    //
    // Create a new class 'LIFOPoint'
    //
    ////////////////////////////////////////
    LIFOPoint = ig.Class.extend({
        x: 0,
        y: 0,

        init: function (x, y) {
            this.x = x;
            this.y = y;
        }
    });

    ////////////////////////////////////////
    //
    // Create a new class 'LIFORect'
    //
    ////////////////////////////////////////
    LIFORect = ig.Class.extend({
        origin: null,
        size: null,

        staticInstantiate: function (x, y, width, height) {
            if (LIFORect.instance == null) {
                return null;
            } else {
                return LIFORect.instance;
            }
        },

        init: function (x, y, width, height) {
            origin = new LIFOPoint(x, y);
            size = new LIFOSize(width, height);

            LIFORect.instance = this;
        },

        /** return the leftmost x-value of 'rect'
		 */
        lifoRectGetMinX: function () {
            return origin.x;
        },

        /** return the rightmost x-value of 'rect'
		 */
        lifoRectGetMaxX: function () {
            return origin.x + size.width;
        },

        /** return the bottommost y-value of `rect'
		 */
        lifoRectGetMinY: function () {
            return origin.y;
        },

        /** return the topmost y-value of `rect'
		 */
        lifoRectGetMaxY: function () {
            return origin.y + size.height;
        },

        lifoRectEqaulToLIFORect: function (rect) {
            return ((LIFORect.LIFOPointEqualToLIFOPoint(this.origin, rect.origin))
					&& (LIFORect.LIFOSizeEqualToLIFOSize(this.size, rect.size)));
        },

        lifoRectContainsLIFOPoint: function (point) {
            if (point.x >= this.lifoRectGetMinX() &&
					point.x <= this.lifoRectGetMaxX() &&
					point.y >= this.lifoRectGetMinY() &&
					point.y <= this.lifoRectGetMaxY()) {

					    return true;
					} else {
					    return false;
					}
        },

        lifoRectIntersectsLIFORect: function (rect) {
            return !(this.lifoRectGetMaxX() < rect.lifoRectGetMinX() ||
					rect.lifoRectGetMaxX() < this.lifoRectGetMinX() ||
					this.lifoRectGetMaxY() < rect.lifoRectGetMinY() ||
					rect.lifoRectGetMaxY() < this.lifoRectGetMinY());
        }
    });

    /** static properties of LIFORect class
	 */
    LIFORect.instance = null;
    LIFORect.TILE_SIZE = 16;

    /** static methods of GirdRect class
	 */
    LIFORect.ConvertFromGridSizeToRealSize = function (gridSize) {
        return new LIFOSize(gridSize.width * ig.game.backgroundMaps[0].tilesize,
				gridSize.height * ig.game.backgroundMaps[0].tilesize);
    };

    LIFORect.ConvertFromGridSizeToRealSize = function (width, height) {
        return new LIFOSize(width * ig.game.backgroundMaps[0].tilesize,
				height * ig.game.backgroundMaps[0].tilesize);
    };

    LIFORect.ConvertFromRealSizeToGridSize = function (realSize) {
        return new LIFOSize(realSize.width / ig.game.backgroundMaps[0].tilesize,
				realSize.height / ig.game.backgroundMaps[0].tilesize);
    };

    LIFORect.ConvertFromRealSizeToGridSize = function (width, height) {
        return new LIFOSize(width / ig.game.backgroundMaps[0].tilesize,
				height / ig.game.backgroundMaps[0].tilesize);
    };

    LIFORect.sizeEqualToSize = function (size1, size2) {
        if ((size1.width == size2.width)
				&& (size1.height == size2.height))
            return true;
        else
            return false;
    };

    LIFORect.ConvertFromGridPointToRealPoint = function (gridPoint) {
        return new LIFOPoint(
				gridPoint.x * ig.game.backgroundMaps[0].tilesize,
				gridPoint.y * ig.game.backgroundMaps[0].tilesize
		);
    };

    LIFORect.ConvertFromGridPointToRealPoint = function (x, y) {
        return new LIFOPoint(
				x * ig.game.backgroundMaps[0].tilesize,
				y * ig.game.backgroundMaps[0].tilesize
		);
    };

    // Math.Floor
    LIFORect.ConvertFromRealPointToGridPoint = function (realPoint, isFloor) {

        // Set the optional parameter if isFloor is undefined
        if (isFloor === undefined) {
            isFloor = true;
        }
        //순우가 수정한 것
        if (isFloor == true) {
            return new LIFOPoint(Math.floor((realPoint.x + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize),
					Math.floor((realPoint.y + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize));
        } else {
            return new LIFOPoint(Math.round((realPoint.x + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize),
					Math.round((realPoint.y + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize));
        }
    };

    // Math.Floor
    LIFORect.ConvertFromRealPointToGridPoint = function (x, y, isXFloor, isYFloor) {

        //Set the optional parameter if isXFloor is undefined
        if (isXFloor === undefined) {
            isXFloor = true;
            isYFloor = true;
        }

        //Set the optional parameter if isYFloor is undefined
        if (isYFloor === undefined) {
            isYFloor = true;
        }

        //순우가 수정한 것
        if (isXFloor == true && isYFloor == true) {
            return new LIFOPoint(Math.floor((x + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize),
					Math.floor((y + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize));
        } else if (isXFloor == true && isYFloor == false) {
            return new LIFOPoint(Math.floor((x + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize),
					Math.round((y + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize));
        } else if (isXFloor == false && isYFloor == true) {
            return new LIFOPoint(Math.round((x + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize),
					Math.floor((y + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize));
        } else {
            return new LIFOPoint(Math.round((x + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize),
					Math.round((y + (ig.game.backgroundMaps[0].tilesize / 2)) / ig.game.backgroundMaps[0].tilesize));
        }
    };
    // Math.Floor
    LIFORect.ConvertFromEdgedRealPointToGridPoint = function (x, y) {
        return new LIFOPoint(Math.ceil(x / ig.game.backgroundMaps[0].tilesize), Math.ceil(y / ig.game.backgroundMaps[0].tilesize));
    }

    LIFORect.LIFOPointEqualToLIFOPoint = function (point1, point2) {
        if ((point1.x == point2.x)
				&& (point1.y == point2.y))
            return true;
        else
            return false;
    };

    LIFORect.moveEntityByLTReference = function (entity, point) {
        point = LIFORect.ConvertFromRealPointToGridPoint(point.x, point.y);
        point = LIFORect.ConvertFromGridPointToRealPoint(point.x, point.y);

        entity.pos.x = point.x;
        entity.pos.y = point.y;
    };

    LIFORect.moveEntityByRTReference = function (entity, point) {
        point = LIFORect.ConvertFromRealPointToGridPoint(point.x, point.y, false, true);
        point = LIFORect.ConvertFromGridPointToRealPoint(point.x, point.y);

        entity.handleMovementTrace();

        entity.pos.x = point.x;
        entity.pos.y = point.y;
    };

    LIFORect.moveEntityByLBReference = function (entity, point) {
        point = LIFORect.ConvertFromRealPointToGridPoint(point.x, point.y, true, false);
        point = LIFORect.ConvertFromGridPointToRealPoint(point.x, point.y);

        entity.pos.x = point.x;
        entity.pos.y = point.y;
    };

    LIFORect.moveEntityByRBReference = function (entity, point) {
        point = LIFORect.ConvertFromRealPointToGridPoint(point.x, point.y, false, false);
        point = LIFORect.ConvertFromGridPointToRealPoint(point.x, point.y);

        entity.pos.x = point.x;
        entity.pos.y = point.y;
    };
});

