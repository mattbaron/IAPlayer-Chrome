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

function initEvents(context) {

   context.player.addEventListener("playing", function() {
      $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause");
      $("#playPauseButton > span").addClass("glyphicon-pause");
   });

   context.player.addEventListener("pause", function() {
      $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause");
      $("#playPauseButton > span").addClass("glyphicon-play");
   });
}

$(document).ready(function() {

   getContext(function(context) {
      Popup.context = context;
      initEvents(context);
      loadStationList(context);
   });
   
   $("#stationList").change(function() {
      Popup.context.playStation($(this).val());
   });
   
   $("#playPauseButton").click(function() {

      var player = Popup.context.player;

      if(player.src === undefined || player.src.length === 0) {
         return;
      }

      if(!player.paused) {
         Log.i("pause");
         player.pause();
      } else {
         Log.i("play");
         player.play();
      }
   });

});

