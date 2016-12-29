var ACTION = {
    MOVE_RIGHT: 1,
    JUMP_RIGHT: 2,
    CLIMB_RIGHT: 3
};

var actions = [ACTION.MOVE_RIGHT, ACTION.MOVE_RIGHT, ACTION.JUMP_RIGHT, ACTION.MOVE_RIGHT, ACTION.MOVE_RIGHT];


var demo = function(game){
    console.log("%cBegin Demo", "color:white; background:#6EB6A7");
};
  
demo.prototype = {
    TILE_SIZE: 128,
    TIME_TO_MOVE: 300,
    TIME_TO_JUMP: 500,
    FRAME_RATE: 10,

    preload: function(){
        // this.game.load.spritesheet('player', 'tiles.png', 128, 128);
        this.game.load.tilemap('tilemap', 'level.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/sprites/pix.png');
        this.game.load.spritesheet('player', 'assets/sprites/player.png', 100, 100, 18);
    },

    create: function(){
        this.setDefaults();
        this.setupStage();
        this.setupPlayer();
        this.setupPhysics();
    },

    setupPhysics: function() {
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.x = 0;
    },

    setDefaults: function() {
        this.actionNumber = 0;
        this.gameOver = false;
        this.wallCollision = false;
        this.playerTweens = [];
        this.isJumping = false;
    },

    setupStage: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
     
        //Change the background colour
        this.game.stage.backgroundColor = "#a9f0ff";
     
        //Add the tilemap and tileset image. The first parameter in addTilesetImage
        //is the name you gave the tilesheet when importing it into Tiled, the second
        //is the key to the asset in Phaser
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('pix', 'tiles');
     
        this.skyLayer = this.map.createLayer('SkyLayer');
        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.groundLayer = this.map.createLayer('GroundLayer');

        //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 100, true, 'GroundLayer');

        //Change the world size to match the size of this layer
        this.groundLayer.resizeWorld();
    },

    setupPlayer: function() {
        //Add the sprite to the game and enable arcade physics on it
        this.sprite = this.game.add.sprite(this.TILE_SIZE, 1152, 'player');
        this.sprite.anchor.setTo(0, 1);
        this.sprite.animations.add('walk', [0,1,2,3,4,5,6,7]);
        this.sprite.animations.add('stand', [8,9,10,11,12,13,14,15]);
        this.sprite.animations.add('fall', [16]);
        this.sprite.animations.add('jump', [17]);


        this.sprite.animations.play('stand', this.FRAME_RATE, true);

        //Make the camera follow the sprite
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
    },

    update: function() {
        //Make the sprite collide with the ground layer
        this.game.physics.arcade.collide(this.sprite, this.groundLayer);

        this.checkFalling();
        this.checkWall();
    },

    checkFalling: function() {
        var tilesBelowPlayer = this.groundLayer.getTiles(this.sprite.position.x, this.sprite.position.y, this.TILE_SIZE, 300, true);

        if(tilesBelowPlayer.length == 0 && !this.isJumping) {
            this.enableGravity();
            this.sprite.animations.play('fall');
            this.gameOver = true;
            this.stopPlayerTweens();
        }
    },

    checkWall: function() {
        var self = this;
        var tilesBlockingPlayer = this.groundLayer.getTiles(this.sprite.position.x + this.sprite.width - 15, this.sprite.position.y - this.sprite.height / 2, 10 , 10, true);

        if(tilesBlockingPlayer.length > 0 && !this.wallCollision) {
            this.stopPlayerTweens();

            if(!this.wallCollision) {
                _.delay(function(){
                    this.wallCollision = false;
                    self.processActions();
                }, 1000);
            }

            this.wallCollision = true;

        }
    },

    stopPlayerTweens: function() {
        this.playerTweens.forEach(function(tween) {
            tween.stop();
        })
    },

    processActions: function() {

        if(this.actionNumber < actions.length && !this.gameOver) {
            this.processAction(actions[this.actionNumber]);
            this.actionNumber++;
        }
        else {
            this.completeGame();
        }
    },

    completeGame: function() {
        // _.delay(this.restartGame.bind(this), 1000);
        this.sprite.animations.play('stand', this.FRAME_RATE, true);
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

    isNextTileBlocked: function() {
        var tilesBlockingPlayer = this.groundLayer.getTiles(this.sprite.position.x + this.sprite.width + this.TILE_SIZE, this.sprite.position.y - this.sprite.height / 2, 10 , 10, true);

        if(tilesBlockingPlayer.length > 0) {
            return true;
        }
        return false;
    },

    isOnGround: function() {
        var tilesBelowPlayer = this.groundLayer.getTiles(this.sprite.position.x, this.sprite.position.y + 50, 50, 300, true);

        if(tilesBelowPlayer.length > 0) {
            return true;
        }

        return false;
    },

    moveRight: function(callback) {

        if(this.isNextTileBlocked()) return;

        this.sprite.animations.play('walk', this.FRAME_RATE, true);

        var tween = this.game.add.tween(this.sprite).to( { x: this.sprite.position.x + this.TILE_SIZE }, this.TIME_TO_MOVE, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function() {
            callback();
        }, this);

        this.playerTweens.push(tween);
    },

    jumpRight: function(callback) {

        if(!this.isOnGround()) return;
        
        this.isJumping = true;
        this.sprite.animations.play('jump', this.FRAME_RATE, true);


        var tweenX = this.game.add.tween(this.sprite).to( { x: this.sprite.position.x + this.TILE_SIZE * 2 }, this.TIME_TO_JUMP, Phaser.Easing.Linear.None);
        tweenX.start();

        var tweenY = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y - this.TILE_SIZE}, this.TIME_TO_JUMP / 2, Phaser.Easing.Quadratic.Out)
        var tweenYDown = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y}, this.TIME_TO_JUMP / 2, Phaser.Easing.Quadratic.In);
        tweenYDown.onComplete.add(function(){
            this.isJumping = false;
            callback();
        }.bind(this));

        tweenY.chain(tweenYDown);
        tweenY.start();
    },

    climbRight: function(callback) {
        this.disableGravity();
        var tweenY = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y - this.TILE_SIZE}, this.TIME_TO_MOVE, Phaser.Easing.Linear.None)
                        .to( { x: this.sprite.position.x + this.TILE_SIZE }, this.TIME_TO_MOVE, Phaser.Easing.Linear.None);

        tweenY.onComplete.add(function() {
            this.enableGravity();
            callback();
        }, this);
        tweenY.start();
    },

    enableGravity: function() {
        this.sprite.body.gravity.y = 2000;
    },

    disableGravity: function() {
        this.sprite.body.gravity.y = 0;
    }
}