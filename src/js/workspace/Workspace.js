function Workspace(options) {
    this._workspace;
    this._isPlaying = false;
    this._toolbox = document.getElementById(options.toolboxId);
    this.el = document.createElement('div');
    this.el.className = 'workspace';
    this._playBtnHTML = '<i class="fa fa-play-circle" aria-hidden="true"></i>';
    this._stopBtnHTML = '<i class="fa fa-stop-circle" aria-hidden="true"></i>';

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
        button.innerHTML = this._playBtnHTML;
        button.setAttribute('title', 'Play');
        parentEl.appendChild(button);
        button.addEventListener('click', this.onPlayStopToggle.bind(this));
    }
};

Workspace.prototype.onPlayStopToggle = function onPlayStopToggle(event) {
    if (this._hasPlayed) {
        this.onReset();
        this._hasPlayed = false;
        event.target.innerHTML = this._playBtnHTML;
        event.target.setAttribute('title', 'Play');
    } else {
        this.onPlay();
        this._hasPlayed = true;
        event.target.innerHTML = this._stopBtnHTML;
        event.target.setAttribute('title', 'Stop');
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

Workspace.prototype.getCode = function getCode(format) {
    var indent = '&nbsp;&nbsp;&nbsp;&nbsp;';
    var code = Blockly.JavaScript.workspaceToCode(this._workspace);
    format = format || 'string';

    // TODO: replace indents with html entities
    if (format.toUpperCase() === 'HTML') {
        code = code.split(/\r?\n/).reduce(function (prev, cur) {
            if(cur.trim().length > 0) {
                prev += '<li>' + cur.replace(/  /g, indent) + '</li>';
            }
            return prev;
        }, '<ul class="workspace__code">');
        code += '</ul>';
    }
    return code;
};

Workspace.prototype.getActions = function play() {
    var code = '(function () {\n';
    code += 'var actions = []\n';
    code += this.getCode();
    code += 'return actions;\n';
    code += '})();\n';
    return eval(code);
};
