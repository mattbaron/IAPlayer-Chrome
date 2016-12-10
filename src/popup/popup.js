function Popup() {
   Popup.context;
}

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

function updateUI(ctx) {
   if (!ctx.player.isPaused()) {
      $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause");
      $("#playPauseButton > span").addClass("glyphicon-pause");
   } else {
      $("#playPauseButton > span").removeClass("glyphicon-play glyphicon-pause");
      $("#playPauseButton > span").addClass("glyphicon-play");
   }
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

function init(ctx) {

}

$(document).ready(function() {

   getContext(function(ctx) {

      Popup.context = ctx;
      initEvents(ctx);
      loadStationList(ctx);
      updateUI(ctx);
   });

   $(".btn").click(function(event) {
      $(this).blur()
   });

   $("#stationList").change(function() {
      Popup.context.playStation($(this).val());
   });

   $("#playPauseButton").click(function() {
      var player = Popup.context.player;

      if (!player.isPaused()) {
         player.pause();
      } else {
         player.play();
      }

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

});
