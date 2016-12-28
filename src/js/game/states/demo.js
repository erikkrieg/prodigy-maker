var ACTION = {
    MOVE_RIGHT: 1,
    JUMP_RIGHT: 2,
    CLIMB_RIGHT: 3
};

var actions = [ACTION.MOVE_RIGHT, ACTION.JUMP_RIGHT, ACTION.MOVE_RIGHT, ACTION.MOVE_RIGHT, ACTION.MOVE_RIGHT, ACTION.MOVE_RIGHT, ACTION.CLIMB_RIGHT, ACTION.MOVE_RIGHT];


var demo = function(game){
    console.log("%cBegin Demo", "color:white; background:#6EB6A7");
};
  
demo.prototype = {
    TILE_SIZE: 128,
    TIME_TO_MOVE: 300,
    TIME_TO_JUMP: 500,
    // position: TILE_SIZE * 1,

    preload: function(){
        this.game.load.spritesheet('player', 'tiles.png', 128, 128);
        this.game.load.tilemap('tilemap', 'test.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'tiles.png');


        this.isMoving = false;
        this.actionNumber = 0;
    },
    create: function(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
     
        //Change the background colour
        this.game.stage.backgroundColor = "#a9f0ff";
     
        //Add the tilemap and tileset image. The first parameter in addTilesetImage
        //is the name you gave the tilesheet when importing it into Tiled, the second
        //is the key to the asset in Phaser
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('platform-sample', 'tiles');
     
        //Add both the background and ground layers.
        this.backgroundlayer = this.map.createLayer('BackgroundLayer');
        this.groundLayer = this.map.createLayer('GroundLayer');
     
        //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 100, true, 'GroundLayer');

        //Add the sprite to the game and enable arcade physics on it
        this.sprite = this.game.add.sprite(this.TILE_SIZE, 0, 'player');
        this.game.physics.arcade.enable(this.sprite);
     
        //Change the world size to match the size of this layer
        this.groundLayer.resizeWorld();

         //Set some physics on the sprite
        this.enableGravity();
        this.sprite.body.gravity.x = 0;
     
        //Make the camera follow the sprite
        this.game.camera.follow(this.sprite);
     
        //Enable cursor keys so we can create some controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        _.delay(this.processActions.bind(this), 1000);
    },

    update: function() {
        //Make the sprite collide with the ground layer
        this.game.physics.arcade.collide(this.sprite, this.groundLayer);
    },

    processActions: function() {
        if(this.actionNumber < actions.length) {
            this.processAction(actions[this.actionNumber]);
            this.actionNumber++;
        }
        else {
            _.delay(this.restartGame.bind(this), 1000);
        }
    },

    restartGame: function() {
        this.game.state.start("Demo");
    },

    processAction: function(action) {
        switch(action) {
            case ACTION.MOVE_RIGHT:
                this.moveRight(this.processActions.bind(this));
                break;
            case ACTION.JUMP_RIGHT:
                this.jumpRight(this.processActions.bind(this));
                break;
            case ACTION.CLIMB_RIGHT:
                this.climbRight(this.processActions.bind(this));
                break;
        }
    },

    moveRight: function(callback) {
        var tween = this.game.add.tween(this.sprite).to( { x: this.sprite.position.x + this.TILE_SIZE }, this.TIME_TO_MOVE, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
            callback();
        }, this);
    },

    jumpRight: function(callback) {
        var tweenX = this.game.add.tween(this.sprite).to( { x: this.sprite.position.x + this.TILE_SIZE * 2 }, this.TIME_TO_JUMP, Phaser.Easing.Linear.None, true);
        tweenX.onComplete.add(function() {
            callback();
        }, this);

        var tweenY = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y - this.TILE_SIZE}, this.TIME_TO_JUMP / 2, Phaser.Easing.Quadratic.Out)
                        .to( { y: this.sprite.position.y }, this.TIME_TO_JUMP / 2, Phaser.Easing.Quadratic.In, true);
    },

    climbRight: function(callback) {
        this.disableGravity();
        var tweenY = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y - this.TILE_SIZE}, this.TIME_TO_MOVE, Phaser.Easing.Linear.None)
                        .to( { x: this.sprite.position.x + this.TILE_SIZE }, this.TIME_TO_MOVE, Phaser.Easing.Linear.None);

        tweenY.onComplete.add(this.enableGravity, this);
        tweenY.start();
    },

    enableGravity: function() {
        this.sprite.body.gravity.y = 4000;
    },

    disableGravity: function() {
        this.sprite.body.gravity.y = 0;
    }
}