function Context() {
   Context.player;
   Context.stationStore;
}

Context.player = new Audio();
Context.stationStore = new StationStore();

function getContext() {
   return Context;
}

function getPlayer() {
   return player;
}

function playStream(streamURL) {
   Context.player.src = streamURL;
   Context.player.play();
}

function playStation(id) {

   console.log("Playing station " + id);

   var station = Context.stationStore.getStation(id);

   console.log(station);

   var playlist = new Playlist(station.url);
   playlist.getStreams(function(streams) {
      playStream(streams[0]);
   });
}

function parseStationData(rawStreamData, callback) {
   try {
      var json = JSON.parse(rawStreamData);

      Context.stationStore = new StationStore();

      for(var id in json) {
         var s = new Station(json[id].name, json[id].url, id);
         Context.stationStore.addStation(s);
      }

      callback(Context.stationStore);

   } catch(exception) {
      Log.e("Exception parsing station data: " + exception);
      Log.e(exception);
   }
}

function loadStationData(callback) {

   $.ajax({
      url: "/stations.json",
      method: "GET",
      dataType: "html",
      success: function(rawStreamData) {
         parseStationData(rawStreamData, callback);
      },
      error: function() {
         Log.e("Error loading stream data");
      }
   });
}

function saveStationData(callback) {

}

function init(callback) {
   loadStationData(callback);
}

$(document).ready(function() {
   console.log("background.js is ready");
   init(function() {
      console.log("background initialization complete");
   });
});
