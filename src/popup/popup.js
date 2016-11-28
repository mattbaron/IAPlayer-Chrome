var background = undefined;

function init(callback) {
   chrome.runtime.getBackgroundPage(function(bg) {
      background = bg;
      loadStationList(background.Context.stationStore);
      if(callback !== undefined) {
         callback();
      }
   });
};

function loadStationList(stationStore) {
   var ids = stationStore.getIDs();
   for(var i = 0; i < ids.length; i++) {
      var station = stationStore.getStation(ids[i]);
      //Log.i(station);
      var option = $("<option>");
      option.attr("value", ids[i]);
      option.text(station.name);
      option.appendTo($("#stationList"));
   }
}

$(document).ready(function() {

   init(function() {
      Log.i("Local initialization complete");
   });
   
   $("#stationList").change(function() {
      background.playStation($(this).val());
   });
   
   $("#playButton").click(function() {
      //Log.i(App.currentStation);
      background.getPlayer().play();
   });

   $("#pauseButton").click(function() {
      Log.i(App.currentStation);
      background.getPlayer().pause();
   });
});

