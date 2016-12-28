var game = new Phaser.Game(800, 600, Phaser.AUTO, 'area-game', { preload: preload, create: create, update: update });
game.state.add("Boot", boot);
game.state.add("Demo", demo);
game.state.add("GameOver", gameOver);

game.state.start("Boot", boot);

function preload() {
    
}

function create() {
    
}

function update() {
    
}