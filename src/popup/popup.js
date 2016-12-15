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

   $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause")
   if (!context.player.isPaused()) {
      $("#playPauseButton > span").addClass("glyphicon-pause");
   } else {
      $("#playPauseButton > span").addClass("glyphicon-play");
   }

   $("#muteButton > span").removeClass("glyphicon-volume-up glyphicon-volume-off");
   if (context.player.isMuted()) {
      $("#muteButton > span").addClass("glyphicon-volume-off");
   } else {
      $("#muteButton > span").addClass("glyphicon-volume-up");
   }
}

function init(context) {

   loadStationList(context);

   $("#playPauseButton").click(function() {
      if (!context.player.isPaused()) {
         context.player.pause();
      } else {
         context.player.play();
      }
   });

   $("#stationList").change(function() {
      context.playStation($(this).val());
   });

   $(".btn").click(function(event) {
      $(this).blur()
   });


   $("#muteButton").click(function() {
      context.player.toggleMute();
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

   context.player.addEventListener("volumechange", function() {
      updateUI(context);
   });


}

$(document).ready(function() {

   getContext(function(context) {
      init(context);
      updateUI(context);
   });

});
