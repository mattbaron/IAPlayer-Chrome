function Context() {
   Context.instance = this;
   this.initialized = false;
   this.stationStore = new StationStore();
   this.player = new AudioPlayer();
   this.currentStation = null;
}

Context.getInstance = function() {
   if(Context.instance === undefined) {
      console.log("background.js Conext.instance is null.  Returning new instance.");
      Context.instance = new Context();
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

Context.prototype.playURL = function(url) {
   console.log("playURL() " + url);
   this.player.prepare(url, function(player) {
      console.log("playURL() ready " + url);
      player.play();
   });
};

Context.prototype.loadStation = function(station) {
   this.currentStation = station;
};

Context.prototype.playStation = function(id) {

   this.currentStation = this.stationStore.getStation(id);

   console.log("Playing station " + id);
   console.log(this.currentStation);

   if(this.currentStation !== undefined) {
      this.playURL(this.currentStation.url);
   }
};

Context.prototype.loadData = function(callback) {

   chrome.storage.sync.get(null, function(data) {
      if(callback !== undefined) {
         callback(data);
      }
   });

};

Context.prototype.saveData = function(callback) {

   chrome.storage.sync.set({"stationMap": this.stationStore.export()}, function() {
      if(callback !== undefined) {
         callback();
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
         context.saveData();
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
