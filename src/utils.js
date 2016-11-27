///////////////////////////////////////////////////////////////////////////////
//
// Utility Functions
//
///////////////////////////////////////////////////////////////////////////////

function hashSort(hash) {
   var keys = [];
   for(var key in hash) keys.push(key);
   return keys.sort(function(a,b) {return hash[a].localeCompare(hash[b])});
}

function sortStations(hash) {
   var keys = [];
   for(var key in hash) keys.push(key);
   return keys.sort(function(a,b) {return hash[a].name.localeCompare(hash[b].name)});
}

function trim(str) {
   return str.replace(/^\s+|\s+$/gm,'');
}

function getUUID() {
   var d = new Date().getTime();
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
   });
   return uuid;
}

///////////////////////////////////////////////////////////////////////////////
//
// Logger
//
///////////////////////////////////////////////////////////////////////////////

function Log() {

}

Log.writeMessage = function(msg, sev) {
   sev = (sev === undefined ? "INFO" : sev);
   var formattedMessage = msg;
   if(chrome) {
      chrome.runtime.getBackgroundPage(function(bg) {
         bg.console.log(formattedMessage);
      });
   } else {
      console.log(formattedMessage);
   }
}

Log.i = function(msg) {
   Log.writeMessage(msg, "INFO");
}

Log.e = function(msg) {
   Log.writeMessage(msg, "ERROR");
}
