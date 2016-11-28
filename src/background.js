function Context() {
   Context.instance = this;
   this.initialized = false;
   this.stationStore = new StationStore();
   this.player = new Audio();
}

Context.getInstance = function() {
   if(Context.instance === undefined) {
      Context.instance = new Context();
      Context.instance.initEvents();
   }
   return Context.instance;
};

Context.prototype.getStationStore = function() {
   return this.stationStore;
};

Context.prototype.getPlayer = function() {
   return this.player;
};

Context.prototype.playStream = function(streamURL) {
   this.player.src = streamURL;
   this.player.play();
};

Context.prototype.playStation = function(id) {

   console.log("Playing station " + id);

   var station = this.stationStore.getStation(id);

   console.log(station);

   var _this = this;

   var playlist = new Playlist(station.url);
   playlist.getStreams(function(streams) {
      _this.playStream(streams[0]);
   });

};

Context.prototype.parseStationData = function(rawStreamData, callback) {
   try {
      var json = JSON.parse(rawStreamData);

      this.stationStore = new StationStore();

      for(var id in json) {
         var s = new Station(json[id].name, json[id].url, id);
         this.stationStore.addStation(s);
      }

      callback(this.stationStore);
      this.initialized = true;

   } catch(exception) {
      console.log("Exception parsing station data: " + exception);
      console.log(exception);
   }
};

Context.prototype.loadStationData = function(callback) {

   var _this = this;

   $.ajax({
      url: "/stations.json",
      method: "GET",
      dataType: "html",
      success: function(rawStreamData) {
         _this.parseStationData(rawStreamData, callback);
      },
      error: function() {
         console.log("Error loading stream data");
      }
   });
};

Context.prototype.saveStationData = function(callback) {

};

Context.prototype.initEvents = function() {
   var _this = this;
   var player = this.player;

   this.player.addEventListener("error", function(e) {

      console.log("player error"); console.log(e);

      if(!player.src.endsWith(";")) {
         player.src = player.src + ";";
         Log.i("Trying " + player.src);
         player.play();
      }

   });
};

function getContext() {
   return Context.getInstance();
}

function init(callback) {
   var context = Context.getInstance();
   context.loadStationData(callback);
}

$(document).ready(function() {

   console.log("background.js is ready");

   init(function() {
      console.log("background initialization complete");
   });

});
