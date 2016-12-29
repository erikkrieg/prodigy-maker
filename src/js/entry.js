(function () {
    var game = new Game();
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));

    // TODO: Stop using global variables!!!11!
    workspace.onPlay = function () {
        window.actions = workspace.getActions().map(function (action) {
            return window.ACTION[action.toUpperCase()];
        });
        console.log('start game', window.actions);
        demo.processActions();
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
