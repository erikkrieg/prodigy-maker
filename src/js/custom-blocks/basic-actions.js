(function () {
    var actionColor = 290;
    var actions = [
        { type: 'move_right', label: '→ Move Right' },
        { type: 'move_left', label: '← Move Left' },
        { type: 'move_wait', label: 'Wait' },
        { type: 'jump_right', label: '↗ Jump Right' },
    ];

    actions.forEach(function (move) {
        Blockly.Blocks[move.type] = {
          init: function() {
            this.jsonInit({
                'type': move.type,
                'message0': move.label,
                'previousStatement': null,
                'nextStatement': null,
                'colour': actionColor,
                'tooltip': '',
                'helpUrl': ''
            });
          }
        };

        Blockly.JavaScript[move.type] = function(block) {
            return 'actions.push("' + move.type + '");\n';
        };
    });
}());
