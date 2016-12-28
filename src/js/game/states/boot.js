var boot = function(game){
    console.log("%cProdigy Maker", "color:white; background:#6EB6A7");
};
  
boot.prototype = {
    preload: function(){
    },
    create: function(){
        //Change the background colour
        this.game.stage.backgroundColor = "#a9f0ff";
        this.game.state.start("Demo");
    }
}