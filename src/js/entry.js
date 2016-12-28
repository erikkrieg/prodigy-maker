(function () {
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));

    // This is for testing.
    window.maker = {
        workspace: workspace,
        game: null
    };
}());
