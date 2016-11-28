function Popup() {
   Popup.context;
}

function loadStationList(stationStore) {
   var ids = stationStore.getIDs();
   for(var i = 0; i < ids.length; i++) {
      var station = stationStore.getStation(ids[i]);
      var option = $("<option>");
      option.attr("value", ids[i]);
      option.text(station.name);
      option.appendTo($("#stationList"));
   }
}

$(document).ready(function() {

   getContext(function(context) {
      Log.i(context);
      Popup.context = context;
      loadStationList(context.getStationStore());
      if(callback !== undefined) {
         callback();
      }
   });
   
   $("#stationList").change(function() {
      Popup.context.playStation($(this).val());
   });
   
   $("#playButton").click(function() {
      Popup.context.getPlayer().play();
   });

   $("#pauseButton").click(function() {
      Popup.context.getPlayer().pause();
   });
});

