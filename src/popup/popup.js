function Popup() {
   Popup.context;
}

function loadStationList(context) {
   var ids = context.stationStore.getIDs();
   for(var i = 0; i < ids.length; i++) {
      var station = context.stationStore.getStation(ids[i]);
      var option = $("<option>");
      option.attr("value", ids[i]);
      option.text(station.name);
      option.appendTo($("#stationList"));
   }

   var currentStation = context.getCurrentStation();
   $("#stationList").val(currentStation.id);
}

$(document).ready(function() {

   getContext(function(context) {
      Popup.context = context;
      loadStationList(context);
   });
   
   $("#stationList").change(function() {
      Popup.context.playStation($(this).val());
   });
   
   $("#playButton").click(function() {
      Popup.context.player.play();
   });

   $("#pauseButton").click(function() {
      Popup.context.player.pause();
   });
});

