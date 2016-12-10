var stream = Array();
stream.pls = "https://somafm.com/sonicuniverse192.pls";
stream.m3u = "http://listen.abacus.fm/mozartpiano.m3u";
stream.direct = "";


function test() {
   var p = new AudioPlayer();
   p.prepare(stream.m3u, function() {
      console.log("ready()");
      p.play();
   });
}

function init() {

   getContext(function(ctx) {

      ctx.loadData(function(stationMap) {
         $("#stationMap").html(JSON.stringify(stationMap, null, 3));
         console.log(stationMap);
      });

   });
}

$(document).ready(function() {

   $("#navClearData").click(function() {
      chrome.storage.sync.clear();
      init();
   });

   $("#navLoadDefaults").click(function() {

      getContext(function(ctx) {

         loadDefaultStations(function(stationMap) {
            console.log(stationMap);
            ctx.setStationMap(stationMap);
            ctx.saveData();
            init();
         });
      });

   });

});
