(function () {
    var game = new Game();
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));
    workspace.onPlay = function () {
        var actions = workspace.getActions().map(function (action) {
            return window.ACTION[action.toUpperCase()]; // TODO: Stop using global variables!!!11!
        });
        game.processActions(actions);
    };
    workspace.onStop = function () {
        game.stop();
    };
    window.maker = {
        workspace: workspace,
        game: game
    };
}());
