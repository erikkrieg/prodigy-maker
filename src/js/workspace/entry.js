(function () {
    var workspace = new Workspace({ 
        id:'main-workspace',
        toolboxId: 'workspace-toolbox'
    });
    workspace.inject(document.getElementById('area-workspace'));
}());
