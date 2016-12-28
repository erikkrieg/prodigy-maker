function Game() {
    var emptyState = { 
        preload: Game.fn, 
        create: Game.fn, 
        update: Game.fn 
    };
    var parent = document.getElementById("area-game");
    var game = new Phaser.Game(parent.clientWidth, parent.clientHeight, Phaser.AUTO, 'area-game', emptyState);
    game.state.add("empty", emptyState);
    game.state.add("Boot", boot);
    game.state.add("Demo", demo);
    game.state.add("GameOver", gameOver);
    this._game = game;
}

Game.prototype.start = function  start() {
    this._game.state.start("Boot");
};

Game.prototype.stop = function  stop() {
    this._game.state.start("empty");
};

Game.fn = function () {
    // This is just being done to prevent the game canvas from being black by default.
    this.game.stage.backgroundColor = "#a9f0ff";
};
