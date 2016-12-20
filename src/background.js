function Context() {
   Context.instance = this;
   this.initialized = false;
   this.stationStore = new StationStore();
   this.player = new AudioPlayer();
   this.currentStation = null;
   this.eventListeners = {};
   this.mainWindow;
}

Context.getInstance = function() {
   if (Context.instance === undefined) {
      Context.instance = new Context();
   }
   return Context.instance;
};

Context.prototype.addEventListener = function(name, callback) {
   name = name.toLowerCase();
   if (this.eventListeners[name] === undefined) {
      this.eventListeners[name] = Array();
   }

   this.eventListeners[name].push(callback);

};

Context.prototype.invokeListeners = function(name, data) {

   name = name.toLowerCase();

   console.log("invokeListeners() " + name);

   if (this.eventListeners[name] === undefined) {
      return;
   }

   for (listener of this.eventListeners[name]) {
      if (listener === null || listener === undefined) {
         console.log("WARNING: null listener in background.js");
      } else {
         console.log("calling back " + name);
         listener(this, data);
      }
   }

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

   if (this.currentStation !== undefined) {
      this.playURL(this.currentStation.url);
   }

   this.invokeListeners("onNewStation", id);
};

Context.prototype.setStationMap = function(stationMap) {
   this.stationStore = new StationStore(stationMap);
   this.invokeListeners("onConfigChange");
};

Context.prototype.loadData = function(callback) {
   var _this = this;
   chrome.storage.sync.get(null, function(data) {
      _this.setStationMap(data["stationMap"]);
      if (callback !== undefined) {
         callback(data["stationMap"]);
      }
   });
};

Context.prototype.saveData = function(callback) {
   console.log("Context.saveData()");

   var _this = this;
   var data = {};
   data.stationMap = this.stationStore.export();

   chrome.storage.sync.set(data, function() {
      _this.invokeListeners("onConfigChange");
      if (callback !== undefined) {
         callback();
      }
   });

};

function getContext() {
   return Context.getInstance();
}

function init(callback) {
   var context = Context.getInstance();
   context.loadData(function(stationMap) {
      callback(context);
   });

}

function focusWindow() {

}

function openWindow() {
   var context = Context.getInstance();

}

$(document).ready(function() {

   init(function(context) {
      console.log("background initialization complete");
   });

});

chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.windows.create({
      url: "/src/popout/popout.html",
      type: "popup",
      width: 400,
      height: 400
   },
   function(window) {
      var context = Context.getInstance();
      context.mainWindow = window;
      console.log(context);
   });

});
