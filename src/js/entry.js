(function () {
    var game = new Game();
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));

    workspace.onPlay = function () {
        console.log('start game', workspace.getActions());
        game.start();
    };

    workspace.onStop = function () {
        console.log('stop game');
        game.stop();
    };

    window.maker = {
        workspace: workspace,
        game: game
    };
}());
