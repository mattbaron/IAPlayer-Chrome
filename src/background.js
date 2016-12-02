function Context() {
   Context.instance = this;
   this.initialized = false;
   this.stationStore = new StationStore();
   this.player = new Audio();
   this.currentStation = null;
}

Context.getInstance = function() {
   if(Context.instance === undefined) {
      console.log("background.js Conext.instance is null.  Returning new instance.");
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

Context.prototype.getCurrentStation = function() {
   return this.currentStation;
};

Context.prototype.playStream = function(streamURL) {
   this.player.src = streamURL;
   this.player.play();
};

Context.prototype.loadStation = function(station) {
   this.currentStation = station;
   this.player = station.id;
};

Context.prototype.playStation = function(id) {

   console.log("Playing station " + id);

   this.currentStation = this.stationStore.getStation(id);

   console.log(this.currentStation);

   var _this = this;

   var playlist = new Playlist(this.currentStation.url);
   playlist.getStreams(function(streams) {
      _this.playStream(streams[0]);
   });

};


Context.prototype.loadData = function(callback) {

   chrome.storage.sync.get(null, function(data) {
      console.log("loadData()");
      console.log(data);
      if(callback !== undefined) {
         callback(data);
      }
   });

};

Context.prototype.saveData = function(callback) {

   console.log("saveData()");

   chrome.storage.sync.set({"stationMap": this.stationStore.export()}, function() {
      if(callback !== undefined) {
         callback();
      }
   });

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

   if(context.initialized === true) {
      callback(context);
   } else {
      loadDefaultStations(function(data) {
         context.stationStore = new StationStore(data);
         callback(context);
      });
   }
}

$(document).ready(function() {

   console.log("background.js is ready");

   init(function(context) {
      console.log("background initialization complete");
      console.log(context);
   });

});
