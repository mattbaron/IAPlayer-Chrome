function testButton() {
   var props = {type: "popup", width: 320, height: 200};
   //chrome.windows.create(props);
   
   
   chrome.runtime.getBackgroundPage(function(bg) {
      bg.player.src = "http://ice2.somafm.com/spacestation-128-mp3";
      bg.player.play();
   });
}

function playStation() {

}

function loadStationList(stationStore) {
   var ids = stationStore.getIDs();
   for(var i = 0; i < ids.length; i++) {
      var station = stationStore.getStation(ids[i]);
      Log.i(station);
      var option = $("<option>");
      option.attr("value", ids[i]);
      option.text(station.name);
      option.appendTo($("#stationList"));
   }
}

function init() {

   App.loadStationData(function(stationStore) {
      loadStationList(stationStore);
   });

}

$(document).ready(function() {

   App.init(function() {
      init();
   });
   
   $("#stationList").change(function() {
      App.playStation($(this).val());
   });
   
});

