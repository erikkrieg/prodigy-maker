var ACTION = {
    MOVE_RIGHT: 1,
    JUMP_RIGHT: 2,
    CLIMB_UP: 3
};

var actions = [];


var demo = function(game){
    console.log("%cBegin Demo", "color:white; background:#6EB6A7");
};
  
demo.prototype = {
    TILE_SIZE: 128,
    TIME_TO_MOVE: 300,
    TIME_TO_JUMP: 500,
    FRAME_RATE: 10,
    FAIL_ACTION_DELAY: 500,

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
        this.isClimbing = false;
        this.isVictory = false;
        this.fallBaseline = 300;
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
        this.foregroundLayer = this.map.createLayer('ForegroundLayer');


        //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 1000, true, 'GroundLayer');

        //Change the world size to match the size of this layer
        this.groundLayer.resizeWorld();
    },

    setupPlayer: function() {
        //Add the sprite to the game and enable arcade physics on it
        this.sprite = this.game.add.sprite(this.TILE_SIZE, 1152, 'player');
        this.sprite.anchor.setTo(-0.30, 1);
        this.sprite.animations.add('walk', [0,1,2,3,4,5,6,7]);
        this.sprite.animations.add('stand', [8,9,10,11,12,13,14,15]);
        this.sprite.animations.add('fall', [16]);
        this.sprite.animations.add('jump', [17]);


        this.sprite.animations.play('stand', this.FRAME_RATE, true);

        //Make the camera follow the sprite
        this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
    },

    update: function() {
        this.game.physics.arcade.overlap(this.sprite, this.backgroundLayer, function(player,object) {
            if(!this.isVictory && object.properties.name == "victory") {
                this.showVictory();
                this.isVictory = true;
            }
        }.bind(this));

        this.checkFalling();
    },

    checkFalling: function() {
        var tilesBelowPlayer = this.groundLayer.getTiles(this.sprite.position.x, this.sprite.position.y, this.TILE_SIZE, this.fallBaseline, true);
        if(tilesBelowPlayer.length == 0 && !this.isJumping && !this.isClimbing && !this.gameOver) {
            this.gameOver = true;
            this.sprite.animations.play('fall');
            this.enableGravity();
            this.stopPlayerTweens();
        }
    },

    stopPlayerTweens: function() {
        this.playerTweens.forEach(function(tween) {
            tween.stop();
        })
    },

    processActions: function() {
        console.log("processActions");
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
        this.game.state.start("Boot");
    },

    processAction: function(action) {
        switch(action) {
            case ACTION.MOVE_RIGHT:
                this.moveRight(this.processActions.bind(this));
                break;
            case ACTION.JUMP_RIGHT:
                this.jumpRight(this.processActions.bind(this));
                break;
            case ACTION.CLIMB_UP:
                this.climbUp(this.processActions.bind(this));
                break;
        }
    },

    isNextTileBlocked: function() {
        var tilesBlockingPlayer = this.groundLayer.getTiles(this.sprite.position.x + this.sprite.width - 15, this.sprite.position.y - this.sprite.height / 2, this.TILE_SIZE , 10, false);

        // For some reason, index -1 appears all of the time
        _.remove(tilesBlockingPlayer, {
            index: -1
        });

        if(tilesBlockingPlayer.length > 0) {
            return true;
        }
        return false;
    },

    isOnGround: function() {
        var tilesBelowPlayer = this.groundLayer.getTiles(this.sprite.position.x, this.sprite.position.y + 50, 50, 300, true);

        if(tilesBelowPlayer.length > 0) {
            console.log("on ground");
            return true;
        }
            console.log("not on ground");

        return false;
    },

    isClimbable: function() {
        var tilesBehindPlayer = this.backgroundLayer.getTiles(this.sprite.position.x, this.sprite.position.y - this.sprite.height / 2, 10, 10);
        var climbable = false;

        _.forEach(tilesBehindPlayer, function(tile) {
            if(tile.properties.climbable) {
                climbable = true;
            }
        });

        console.log("isClimable", climbable, tilesBehindPlayer);
        return climbable;
    },

    climbUp: function(callback) {
        var self = this;
        this.sprite.animations.play('walk', this.FRAME_RATE, true);

        if(this.isClimbable()) {
            this.isClimbing = true;
            var tween = this.game.add.tween(this.sprite).to( {
                y: this.sprite.position.y - 255
            }, 1000, Phaser.Easing.Linear.None);
            tween.onComplete.add(function() {
                this.fallBaseline = 10;
                this.isClimbing = false;
                callback();
            }.bind(this));
            tween.start();
        }
        else {
            _.delay(function(){
                callback();
            }.bind(this), self.FAIL_ACTION_DELAY);
        }

    },

    moveRight: function(callback) {
        var self = this;
        this.sprite.animations.play('walk', this.FRAME_RATE, true);

        if(this.isNextTileBlocked()) {
            _.delay(function(){
                callback();
            }.bind(this), self.FAIL_ACTION_DELAY);
        }
        else {
            var tween = this.game.add.tween(this.sprite).to( { x: this.sprite.position.x + this.TILE_SIZE }, this.TIME_TO_MOVE, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function() {
                callback();
            }, this);

            this.playerTweens.push(tween);
        }
        
    },

    jumpRight: function(callback) {
        if(!this.isOnGround()) return;
        
        this.isJumping = true;
        this.sprite.animations.play('jump', this.FRAME_RATE, true);


        if(!this.isNextTileBlocked()) {
            var tweenX = this.game.add.tween(this.sprite).to( { x: this.sprite.position.x + this.TILE_SIZE * 2 }, this.TIME_TO_JUMP, Phaser.Easing.Linear.None);
            tweenX.start();
        }

        console.log("next tile blocked: ", this.isNextTileBlocked());

        var tweenY = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y - this.TILE_SIZE}, this.TIME_TO_JUMP / 2, Phaser.Easing.Quadratic.Out)
        var tweenYDown = this.game.add.tween(this.sprite).to( { y: this.sprite.position.y}, this.TIME_TO_JUMP / 2, Phaser.Easing.Quadratic.In);
        tweenYDown.onComplete.add(function(){
            this.isJumping = false;
            callback();
        }.bind(this));

        tweenY.chain(tweenYDown);
        tweenY.start();
    },

    showVictory: function() {
        _.delay(function() {
            alert("Victory!");
        }, 500);
    },

    enableGravity: function() {
        this.sprite.body.gravity.y = 2000;
    },

    disableGravity: function() {
        this.sprite.body.gravity.y = 0;
    }
}