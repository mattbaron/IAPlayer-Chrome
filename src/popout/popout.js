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

function selectStation(id) {

   $("#stationList div").removeClass("nowPlaying");
   $("#" + id).addClass("nowPlaying");

   // Scroll to the currently selected item in #stationList
   $("#stationList").scrollTop(
      $("#stationList").scrollTop() +
      $(".nowPlaying").position().top -
      $("#stationList").height() / 2
   );

}

function loadStationItem(context, id) {

   var station = context.stationStore.getStation(id);

   if(station.name.length === 0) {
      return;
   }

   var div = $("<div>");

   div.attr("id", station.id).attr("data-id", station.id).html(station.name);

   div.addClass("stationListItem");
   div.appendTo($("#stationList"));

   div.click(function() {
      var id = $(this).attr("data-id");
      selectStation(id);
      context.playStation(id);
   });

}

function loadStationList(context) {
   for(id of context.stationStore.getIDs()) {
      loadStationItem(context, id);
   }
}

function initEvents(context) {
   context.addEventListener("error", function(event) {
      Log.i(event);
   });
}

function updateUI(context) {
   if(!context.player.isPaused()) {
      $("#playPauseButton span").removeClass("glyphicon-play glyphicon-pause").addClass("glyphicon-pause");
   } else {
      $("#playPauseButton span").removeClass("glyphicon-play glyphicon-pause").addClass("glyphicon-play");
   }

   if(context.player.isMuted()) {
      $("#muteButton span").removeClass("glyphicon-volume-up glyphicon-volume-off").addClass("glyphicon-volume-off");
   } else {
      $("#muteButton span").removeClass("glyphicon-volume-up glyphicon-volume-off").addClass("glyphicon-volume-up");
   }
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

      if(currentStation) {
         selectStation(currentStation.id);
      }

      ctx.player.addEventListener("playing",function() {
         updateUI(ctx);
      });

      ctx.player.addEventListener("pause", function() {
         updateUI(ctx);
      });

      ctx.player.addEventListener("volumechange", function() {
         updateUI(ctx);
      });

      $("#playPauseButton").click(function() {
         if(ctx.player.isPaused()) {
            ctx.player.play();
         } else {
            ctx.player.pause();
         }
      });

      $("#muteButton").click(function() {
         if(ctx.player.isMuted()) {
            ctx.player.mute(false);
         } else {
            ctx.player.mute(true);
         }
      });

      $(".btn").click(function(event) {
         $(this).blur()
      });

      ctx.addEventListener("newstation", function(context, id) {
         Log.i("popout newstation");
         selectStation(id);
      });

      updateUI(ctx);
      resize();
   });

});

$(window).resize(function() {
   resize();
});
