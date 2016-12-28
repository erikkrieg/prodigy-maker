(function () {
    var moveColor = 290;
    var movement = [
        { type: 'move_right', label: 'Move Right' },
        { type: 'move_left', label: 'Move Left' },
        { type: 'move_wait', label: 'Wait' },
    ];

    movement.forEach(function (move) {
        Blockly.Blocks[move.type] = {
          init: function() {
            this.jsonInit({
                'type': move.type,
                'message0': move.label,
                'previousStatement': null,
                'nextStatement': null,
                'colour': moveColor,
                'tooltip': '',
                'helpUrl': ''
            });
          }
        };

        Blockly.JavaScript[move.type] = function(block) {
            return 'console.log(\'' + move.label + '\');\n';
        };
    });

}());