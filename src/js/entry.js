(function (root) {
    var game = new Game();
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));
    workspace.onPlay = function () {
        var actions = workspace.getActions().map(actionMap);
        console.log("onPlay");
        game.processActions(actions);
    };
    workspace.onReset = function () {
        game.resetState();
    };
    root.workspace = workspace;
    root.game = game;
    function actionMap(action) {
        return window.ACTION[action.toUpperCase()]; // TODO: Stop using global variables!!!11!
    }
}(maker));
