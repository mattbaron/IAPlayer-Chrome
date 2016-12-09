var PLAY_ICON  = "/icons/ic_play_circle_outline_black_18dp.png";
var PAUSE_ICON = "/icons/ic_pause_circle_outline_black_18dp.png";
var UNMUTE_ICON = "/icons/ic_volume_up_black_18dp.png";
var MUTE_ICON = "/icons/ic_volume_off_black_18dp.png";

function Popout() {
   var context;
}

function resize() {
   $("#stationList").outerHeight(
      $(window).height() -
      $("#contentTop").outerHeight(true) -
      $("#contentBottom").outerHeight(true) -
      parseInt($("#stationList").css("margin-top")) -
      parseInt($("#stationList").css("margin-bottom"))
   );
}

function unSelectStations() {
   $("#stationList div").removeClass("nowPlaying");
}

function selectStation(id) {
   unSelectStations();
   $("#" + id).addClass("nowPlaying");
}

function loadStationItem(context, id) {

   var station = context.stationStore.getStation(id);

   if(station.name.length === 0) {
      return;
   }

   var div = $("<div>");

   div.attr("id", station.id);
   div.attr("data-id", station.id);
   div.html(station.name);
   div.addClass("stationListItem");
   div.appendTo($("#stationList"));

   div.click(function() {
      var id = $(this).attr("data-id");
      selectStation(context, id);
      context.playStation(id);
   });

}

function loadStationList(context) {
   for(var id of context.stationStore.getIDs()) {
      loadStationItem(context, id);
   }
}

function initEvents(context) {
   context.addEventListener("error", function(event) {
      Log.i(event);
   });
}

function init() {

}

window.onload = function() {
  resize();
};

$(document).ready(function() {

   getContext(function(ctx) {
      loadStationList(ctx);
      var currentStation = ctx.getCurrentStation();
      if(currentStation.id) {
         selectStation(currentStation.id);
      }
   });

   resize();
});

$(window).resize(function() {
   resize();
});
