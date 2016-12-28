function Workspace(options) {
    this._workspace;
    this._isPlaying = false;
    this._toolbox = document.getElementById(options.toolboxId);
    this.el = document.createElement('div');
    this.el.className = 'workspace';

    if (options.id) {
        this.el.setAttribute('id', options.id);
    }
}

Workspace.prototype.inject = function inject(parentEl) {
    var button;
    if (!this._workspace) {
        parentEl.appendChild(this.el);
        this._parentEl = parentEl;
        this._workspace = Blockly.inject(this.el, { toolbox: this._toolbox });
        
        // Resizing does not seem needed, but leaving it just in case
        // window.addEventListener('resize', this.onResize.bind(this), false);
        // this.onResize();
        Blockly.svgResize(this._workspace);
        button = document.createElement('button');
        button.className = 'workspace__play-btn js-workspace-play';
        button.innerHTML = 'Play';
        parentEl.appendChild(button);
        button.addEventListener('click', this.onPlayStopToggle.bind(this));
    }
};

Workspace.prototype.onPlayStopToggle = function onPlayStopToggle(event) {
    if (this._isPlaying) {
        this.onStop();
        this._isPlaying = false;
        event.target.innerHTML = 'Play';
    } else {
        this.onPlay();
        this._isPlaying = true;
        event.target.innerHTML = 'Stop';
    }
};

Workspace.prototype.onResize = function onResize(event) {
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

Workspace.prototype.getCode = function getCode() {
    return Blockly.JavaScript.workspaceToCode(this._workspace); 
};

Workspace.prototype.getActions = function play() {
    var code = '(function () {\n';
    code += 'var actions = []\n';
    code += this.getCode();
    code += 'return actions;\n';
    code += '})();\n';
    return eval(code);
};
