var PLAY_ICON  = "/icons/ic_play_circle_outline_black_18dp.png";
var PAUSE_ICON = "/icons/ic_pause_circle_outline_black_18dp.png";
var UNMUTE_ICON = "/icons/ic_volume_up_black_18dp.png";
var MUTE_ICON = "/icons/ic_volume_off_black_18dp.png";

function resize() {
   $("#stationList").outerHeight(
      $(window).height() -
      $("#contentTop").outerHeight(true) -
      $("#contentBottom").outerHeight(true) -
      parseInt($("#stationList").css("margin-top")) -
      parseInt($("#stationList").css("margin-bottom"))
   );
}

function getPlayer() {
   return $("#audioPlayer")[0];
}

function onStreamError(event) {
   var player = event.target;
   Log.e("STREAM ERROR: " + player.src);
   Log.e(event);

   // Try playing the stream with trailing semicolon for ShoutCast
   if(!player.src.endsWith(";")) {
      player.src = player.src + ";";
      Log.i("Trying " + player.src);
      player.play();
   }
}

function playStation(station) {
   var player = getPlayer();

   if(!player.paused) {
      player.pause();
   }

   Log.i("playStation() " + station);

   $("#stationList div").removeClass("nowPlaying");
   $("#" + station.id).addClass("nowPlaying");

   var playlist = new Playlist(station.url);

   playlist.getStreams(function(streams) {
      Log.i("play " + streams[0]);
      player.src = streams[0]
      player.play();
   });
}

function loadStationItem(station) {

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
      playStation(station);
   });

}

function loadStationList() {
   App.loadStationData(function(stationStore) {
      for(var id of stationStore.getIDs()) {
         loadStationItem(stationStore.getStation(id));
      }
      initEvents();
   });
}

function initEvents() {

   $(".stationListItem").contextmenu(function(event) {

      if (event.which !== 3) {
         return true;
      }

      var id = $(this).attr("data-id");
      var station = App.stationStore.getStation(id);

      var menu  = new Menu();

      //menu.addItem(station.name);
      //menu.addSeparator();

      menu.addItem("Play", function(menuItem) {
         menuItem.menu.destroy();
         playStation(station);
      });

      menu.addItem("Edit", function(menuItem) {
         menuItem.menu.destroy();
      });

      menu.show(event);

      event.preventDefault();
      return false;
   });
}

onload = function() {
  resize();
};

$(document).ready(function() {

   App.init();
   loadStationList();

   var player = getPlayer();

   player.addEventListener("error", function(event) {
      onStreamError(event);
   });

   player.addEventListener("loadstart", function(event) {
      Log.i("loadstart");
   });

   player.addEventListener("playing", function(event) {
      Log.i("playing");
      $("#playPauseButton img").attr("src", PAUSE_ICON);
   });

   player.addEventListener("pause", function(event) {
      Log.i("paused");
      $("#playPauseButton img").attr("src", PLAY_ICON);
   });

   player.addEventListener("volumechange", function(event) {
      Log.i("volumechange");
      if(player.muted) {
         $("#muteButton img").attr("src", MUTE_ICON);
      } else {
         $("#muteButton img").attr("src", UNMUTE_ICON);
      }
   });

   $("#stopButton").click(function() {
      getPlayer().pause();
   });

   $("#playPauseButton").click(function() {
      var player = getPlayer();

      if(player.src === undefined || player.src.length === 0) {
         return;
      }

      if(!player.paused) {
         player.pause();
      } else {
         player.play();
      }

   });

   $("#muteButton").click(function() {
      var player = getPlayer();
      if(player.muted) {
         player.muted = false;
      } else {
         player.muted = true;
      }

   });

   resize();
});

$(window).resize(function() {
   resize();
});
