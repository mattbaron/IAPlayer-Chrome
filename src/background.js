function Context() {
   Context.instance = this;
   this.initialized = false;
   this.stationStore = new StationStore();
   this.player = new Audio();
   this.currentStation = undefined;
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
   if(this.currentStation === undefined) {
      this.currentStation = this.stationStore.getStation();
   }
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

Context.prototype.parseStationData = function(rawStreamData, callback) {
   try {
      var json = JSON.parse(rawStreamData);

      this.stationStore = new StationStore();

      for(var id in json) {
         var s = new Station(json[id].name, json[id].url, id);
         this.stationStore.addStation(s);
      }

      this.currentStation = this.stationStore.getStation();
      callback(this);
      this.initialized = true;

   } catch(exception) {
      console.log("Exception parsing station data: " + exception);
      console.log(exception);
   }
};

Context.prototype.loadStationData = function(callback) {

   console.log("background.js loadStationData()");

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

   if(context.initialized === true) {
      callback(context);
   } else {
      context.loadStationData(callback);
   }

}

$(document).ready(function() {

   console.log("background.js is ready");

   init(function(context) {
      console.log("background initialization complete");
   });

});
