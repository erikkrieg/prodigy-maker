(function (root) {

    function createOverlay() {
        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        return overlay;
    }

    function createModal(content) {
        var modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = content;
        return modal;
    }

    function GameModal(options) {
        this.render(options.content);
    }

    GameModal.prototype.render = function render(content) {
        this._modal = createModal(content);
        this._overlay = createOverlay();
        this._overlay.appendChild(this._modal);
        document.body.appendChild(this._overlay);
    };

    GameModal.prototype.close = function close() {
        if (this._overlay) {
            document.body.removeChild(this._overlay);
            this._modal = null;
            this._overlay = null;
        }
    };

    root.GameModal = GameModal;
}(maker));
