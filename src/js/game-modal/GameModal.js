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

    function onClick(event) {
        if (event.target && event.target.className.indexOf('js-modal-close') > -1) {
            this.close();
        }
    }

    function GameModal(options) {
        this.onClick = onClick.bind(this);
        this.render(options.content);
    }

    GameModal.prototype.render = function render(content) {
        this._modal = createModal(content);
        this._overlay = createOverlay();
        this._overlay.appendChild(this._modal);
        this._modal.addEventListener('click', this.onClick);
        document.body.appendChild(this._overlay);
    };
    

    GameModal.prototype.close = function close() {
        if (this._overlay) {
            document.body.removeChild(this._overlay);
            this._modal.removeEventListener('click', this.onClick);
            this._modal = null;
            this._overlay = null;
        }
    };

    root.GameModal = GameModal;
}(maker));
