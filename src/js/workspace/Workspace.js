function Workspace(options) {
    this._workspace;
    this._toolbox = document.getElementById(options.toolboxId);
    this.el = document.createElement('div');
    this.el.className = 'workspace';

    if (options.id) {
        this.el.setAttribute('id', options.id);
    }
}

Workspace.prototype.inject = function inject(parentEl) {
    parentEl.appendChild(this.el);
    this._workspace = Blockly.inject(this.el, { toolbox: this._toolbox });
};
