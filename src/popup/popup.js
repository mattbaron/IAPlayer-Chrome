function loadStationList(context) {

   var ids = context.stationStore.getIDs();

   var option = $("<option>");
   option.attr("value", "");
   option.text("Select a station...");
   option.appendTo($("#stationList"));

   for (var i = 0; i < ids.length; i++) {
      var station = context.stationStore.getStation(ids[i]);
      var option = $("<option>");
      option.attr("value", ids[i]);
      option.text(station.name);
      option.appendTo($("#stationList"));
   }

   var currentStation = context.getCurrentStation();

   if (currentStation !== null) {
      $("#stationList").val(currentStation.id);
   }
}

function updateUI(context) {
   if (!context.player.isPaused()) {
      $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause");
      $("#playPauseButton > span").addClass("glyphicon-pause");
   } else {
      $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause");
      $("#playPauseButton > span").addClass("glyphicon-play");
   }
}

function init(context) {

   loadStationList(context);

   $("#playPauseButton").click(function() {
      var player = context.player;

      if (!player.isPaused()) {
         player.pause();
      } else {
         player.play();
      }
   });

   $("#stationList").change(function() {
      context.playStation($(this).val());
   });

   $(".btn").click(function(event) {
      $(this).blur()
   });

   $("#popoutButton").click(function() {
      chrome.windows.create({
         url: "/src/popout/popout.html",
         type: "popup",
         width: 400,
         height: 400
      });
   });

   $("#optionsButton").click(function() {
      chrome.tabs.create({
         url: "/src/options/options.html",
      });
   });

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
      init(context);
      updateUI(context);
   });

});
