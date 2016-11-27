///////////////////////////////////////////////////////////////////////////////
//
// App (Comment added to dev branch)
//
///////////////////////////////////////////////////////////////////////////////

function App() {
   App.stationStore;
}

App.stationStore = new StationStore();

App.init = function() {

};

App.parseStationData = function(rawStreamData, callback) {
   try {
      var json = JSON.parse(rawStreamData);

      App.stationStore = new StationStore();

      for(var id in json) {
         var s = new Station(json[id].name, json[id].url, id);
         App.stationStore.addStation(s);
      }

      callback(App.stationStore);

   } catch(exception) {
      Log.e("Exception parsing station data: " + exception);
      Log.e(exception);
   }
}

App.loadStationData = function(callback) {

   $.ajax({
      url: "/stations.json",
      method: "GET",
      dataType: "html",
      success: function(rawStreamData) {
         App.parseStationData(rawStreamData, callback);
      },
      error: function() {
         Log.e("Error loading stream data");
      }
   });
};

App.saveStationData = function(callback) {

};

///////////////////////////////////////////////////////////////////////////////
//
// StationStore
//
///////////////////////////////////////////////////////////////////////////////

function StationStore() {
   this.stationMap = new Array();
}

StationStore.prototype.addStation = function(newStation) {
   this.stationMap[newStation.id] = newStation;
};

StationStore.prototype.getStation = function(id) {
   return this.stationMap[id];
};

StationStore.prototype.getStationMap = function() {
   return this.stationMap;
};

StationStore.prototype.getIDs = function() {
   var keys = [];
   var hash = this.stationMap;
   for(var key in hash) keys.push(key);
   return keys.sort(function(a,b) {return hash[a].name.localeCompare(hash[b].name)});
};

///////////////////////////////////////////////////////////////////////////////
//
// Playlist
//
///////////////////////////////////////////////////////////////////////////////

function Playlist(url) {
   this.url = url;
}

Playlist.prototype.parsePlaylist = function(playlistText, callback) {
   Log.i("Parsing playlist:\n" + playlistText);
   var streams = new Array();

   var regex = /\s*File\d+=(.*)/g;

   playlistText.split("\n").forEach(function(line) {
      if(line.startsWith("http")) {
         streams.push(line);
      } else {
         var match = regex.exec(line);
         if(match != null) {
            streams.push(match[1]);
         }
      }
   });

   if(callback !== undefined) {
      callback(streams);
   }
};

Playlist.prototype.getStreams = function(callback) {
   var thisObject = this;
   $.ajax({
      url: this.url,
      method: "GET",
      dataType: "html",
      success: function(playlistText) {
         thisObject.parsePlaylist(playlistText, callback);
      },
      error: function() {
         Log.e("Error fetching playlist contents");
      }
   });
};

///////////////////////////////////////////////////////////////////////////////
//
// Player
//
///////////////////////////////////////////////////////////////////////////////
function Player() {
   this.audio = new Audio();
}

function setURL(url) {
   this.audio.src = url;
}

function play() {
   this.audio.play();
}

function pause() {
   this.audio.pause();
}

function toggle() {
   if(!this.audio.paused) {
      this.audio.pause();
   } else {
      this.audio.play();
   }
}

///////////////////////////////////////////////////////////////////////////////
//
// Station
//
///////////////////////////////////////////////////////////////////////////////
function Station(name, url, id) {
   this.name = name;
   this.url = url;
   this.id = id;
}

Station.prototype.toString = function() {
  return "name=" + this.name + ", id=" + this.id + ", url=" + this.url;
};

