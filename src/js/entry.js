(function () {
    var game = new Game();
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));
    workspace.onPlay = function () {
        var actions = workspace.getActions().map(actionMap);
        game.processActions(actions);
    };
    workspace.onReplay = function () {
        var actions = workspace.getActions().map(actionMap);
        game.resetState();
        game.processActions(actions);
    };
    window.maker = {
        workspace: workspace,
        game: game
    };

    function actionMap(action) {
        return window.ACTION[action.toUpperCase()]; // TODO: Stop using global variables!!!11!
    }
}());
