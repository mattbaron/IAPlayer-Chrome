///////////////////////////////////////////////////////////////////////////////
//
// iaplayer.js
//
///////////////////////////////////////////////////////////////////////////////

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

      for(id in data) {
         data[id].id = id;
      }

      if(callback !== undefined) {
         callback(data);
      }

   });
};

///////////////////////////////////////////////////////////////////////////////
//
// StationStore
//
///////////////////////////////////////////////////////////////////////////////

function StationStore(map) {
   if(map !== undefined) {
      this.stationMap = map;
   } else {
      this.stationMap = {};
   }
}

StationStore.prototype.add = function(object) {
   if(object.id === undefined) {
      object.id = getUUID();
   }
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
function AudioPlayer() {
   this.audio = new Audio();
   this.events = Array();
   
   this.currentStream;
   
   var _this = this;
   
   this.audio.addEventListener("error", function(event) {
      console.log("ERROR playing " + _this.audio.src);

      if(!_this.audio.src.endsWith(";")) {
         _this.audio.src = _this.audio.src + ";";
         console.log("Trying " + _this.audio.src);
         _this.audio.play();
      } else {
         _this.audio.pause;
         _this.audio.src = _this.currentStream;
         console.log("FATAL ERROR playing " + _this.audio.src);
      }
   });
}

AudioPlayer.prototype.addEventListener = function(name, callback) {
   this.events[name] = callback;
   this.audio.addEventListener(name, callback);
};

AudioPlayer.prototype.setSource = function(streamURL) {
   this.audio.src = this.currentStream = streamURL;
};

AudioPlayer.prototype.prepare = function(url, readyCallback) {
   
   var _this = this;
   
   if(url.toLowerCase().includes(".pls") || url.toLowerCase().includes(".m3u")) {
      
      var playlist = new Playlist(url);

      playlist.getStreams(function(streams) {
         _this.setSource(streams[0]);
         if(readyCallback !== undefined) {
            readyCallback(_this);
         }
      });
      
   } else {
      _this.setSource(url);
      if(readyCallback !== undefined) {
         readyCallback(_this);
      }
   }
   
};

AudioPlayer.prototype.play = function() {
   this.audio.play();
};

AudioPlayer.prototype.pause = function() {
   this.audio.pause();
};

AudioPlayer.prototype.mute = function(value) {
   this.audio.muted = value;
};

AudioPlayer.prototype.togglePlayPause = function() {
   if(!this.audio.paused) {
      this.audio.pause();
   } else {
      this.audio.play();
   }
};

AudioPlayer.prototype.isPaused = function() {
   return this.audio.paused;
};

AudioPlayer.prototype.isMuted = function() {
   return this.audio.muted;
};

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

