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
    this._game.state.start("Boot");
}

Game.prototype.processActions = function  processActions(actions) {
    // TODO: these actions should not be stored globally. Darien is a big goof <3
    window.actions = actions;
    this._game.state.getCurrentState().processActions();
};

Game.prototype.resetState = function resetState() {
    this._game.state.start(this._game.state.current);
};

Game.fn = function () {
    // This is just being done to prevent the game canvas from being black by default.
    this.game.stage.backgroundColor = "#a9f0ff";
};
