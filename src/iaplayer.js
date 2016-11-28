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

