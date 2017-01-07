function init(context) {

   //context.loadData(function(stationMap) {
   //   $("#stationMap").html(JSON.stringify(stationMap, null, 3));
   //   console.log(stationMap);
   //});

   $("#stationMap").html(JSON.stringify(context.stationStore.getStationMap(), null, 3));


   $("#navClearData").click(function() {
      chrome.storage.sync.clear();
      init(context);
   });

   $("#navLoadDefaults").click(function() {
      loadDefaultStations(function(stationMap) {
         console.log(stationMap);
         context.setStationMap(stationMap);
         context.saveData();
         init(context);
      });
   });

}

$(document).ready(function() {

   getContext(function(context) {
      init(context);
   });

});
