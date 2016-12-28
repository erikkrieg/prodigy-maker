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
    if (!this._workspace) {
        parentEl.appendChild(this.el);
        this._parentEl = parentEl;
        this._workspace = Blockly.inject(this.el, { toolbox: this._toolbox });
        
        // Resizing does not seem needed, but leaving it just in case
        // window.addEventListener('resize', this.onResize.bind(this), false);
        // this.onResize();
        Blockly.svgResize(this._workspace);
    }
};

Workspace.prototype.onResize = function onResize(e) {
    // Compute the absolute coordinates and dimensions of workspace's parent.
    var el = this.el;
    var parent = this._parentEl;
    var x = 0;
    var y = 0;
    do {
      x += parent.offsetLeft;
      y += parent.offsetTop;
      parent = parent.offsetParent;
    } while (parent);
    // Position blocklyDiv over blocklyArea.
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = this._parentEl.offsetWidth + 'px';
    el.style.height = this._parentEl.offsetHeight + 'px';
};