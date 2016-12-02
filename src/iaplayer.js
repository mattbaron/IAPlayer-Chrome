function getContext(callback) {
   chrome.runtime.getBackgroundPage(function(background) {
      if(callback !== undefined) {
         callback(background.getContext());
      }
   });
}

function getBackgroundPage(callback) {
   chrome.runtime.getBackgroundPage(function(background) {
      if(callback !== undefined) {
         callback(background);
      }
   });
}

function loadDefaultStations(callback) {
   $.getJSON('/stations.json', function(data) {
      Log.i("loadDefaultStations()");
      Log.i(data);
   });
};

///////////////////////////////////////////////////////////////////////////////
//
// StationStore
//
///////////////////////////////////////////////////////////////////////////////

function StationStore() {
   this.stationMap = {};
}

StationStore.prototype.add = function(object) {
   this.stationMap[object.id] = object;
};

StationStore.prototype.getStation = function(id) {
   if(id === undefined) {
      id = (this.getIDs())[0];
   }
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

StationStore.prototype.export = function() {
   return this.stationMap;
};

StationStore.prototype.import = function(stationMap) {
   this.stationMap = object;
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

Station.prototype.export = function() {
   var object = {};
   object.id = this.id;
   object.name = this.name;
   object.url = this.url;
   return object;
};

Station.import = function(object) {
   return new Station(object.name, object.url, object.id);
};
