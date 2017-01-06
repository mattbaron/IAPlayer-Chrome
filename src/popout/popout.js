var PLAY_ICON = "/icons/ic_play_circle_outline_black_18dp.png";
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

   $("#stationList div").remove();

   for(id of context.stationStore.getIDs()) {
      loadStationItem(context, id);
   }

   $(".stationListItem").contextmenu(function(event) {

      if(event.which !== 3) {
         return true;
      }

      var id = $(this).attr("data-id");
      Log.i("context " + id);

      var menu = new Menu();
      menu.setData(id);
      menu.addItem("Play", function(menuItem) {
         context.playStation(menuItem.menu.getData());
         menuItem.menu.destroy();
      });

      menu.show(event);

      event.preventDefault();
   });
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
      $("#muteButton span")
         .removeClass("glyphicon-volume-up glyphicon-volume-off")
         .addClass("glyphicon-volume-off");
   } else {
      $("#muteButton span")
         .removeClass("glyphicon-volume-up glyphicon-volume-off")
         .addClass("glyphicon-volume-up");
   }
}

function init(context) {

   loadStationList(context);

   var currentStation = context.getCurrentStation();

   if(currentStation) {
      selectStation(currentStation.id);
   }

   context.player.addEventListener("playing", function() {
      updateUI(context);
   });

   context.player.addEventListener("pause", function() {
      updateUI(context);
   });

   context.player.addEventListener("volumechange", function() {
      updateUI(context);
   });

   context.addEventListener("onNewStation", function(context, id) {
      Log.i("popout.js onNewStation");
      selectStation(id);
   });

   context.addEventListener("onConfigChange", function(context, id) {
      loadStationList(context);
   });

   $("#playPauseButton").click(function() {
      if(context.player.isPaused()) {
         context.player.play();
      } else {
         context.player.pause();
      }
   });

   $("#muteButton").click(function() {
      if(context.player.isMuted()) {
         context.player.mute(false);
      } else {
         context.player.mute(true);
      }
   });

   $("#optionsButton").click(function() {
      chrome.tabs.create({
         url: "/src/options/options.html",
      });
   });

   $(".btn").click(function(event) {
      $(this).blur()
   });

   updateUI(context);
   resize();
}

window.onload = function() {
   resize();
};

$(document).ready(function() {

   getContext(function(context) {
      init(context);
   });

});

$(window).resize(function() {
   resize();
});
