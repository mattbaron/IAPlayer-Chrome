function testButton() {
   var props = {type: "popup", width: 320, height: 200};
   //chrome.windows.create(props);
   
   
   chrome.runtime.getBackgroundPage(function(bg) {
      bg.player.src = "http://ice2.somafm.com/spacestation-128-mp3";
      bg.player.play();
   });
}

$(document).ready(function() {
   Log.i("popup.js ready");
   $("#test").html("foobar");
   
   $("#testButton").click(function() {
      testButton();
   });
   
});

