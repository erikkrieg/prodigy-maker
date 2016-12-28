function Game() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'area-game', { 
        preload: Game.fn, 
        create: Game.fn, 
        update: Game.fn 
    });
    game.state.add("Boot", boot);
    game.state.add("Demo", demo);
    game.state.add("GameOver", gameOver);
    game.state.start("Boot", boot);
    return game;
}

Game.fn = function () {};
