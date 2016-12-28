var gameOver = function(game){
};
  
gameOver.prototype = {
    preload: function(){
    },
    create: function(){
        var dialog = confirm("Game Over! Try again?");
        if (dialog == true) {
            this.game.state.start("Demo");
        } else {
            this.game.state.start("Demo");
        }
    },

}