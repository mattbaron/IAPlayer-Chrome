// options.js

function Options {
   var context;
}

function editStationDialog(id) {
   var station = context.stationStore.getStation(id);
   console.log(id);

   $("#stationDialogTitle").text("Edit Station");
   $("#stationDialog").attr("data-id", station.id);
   $("#stationDialog #stationName").val(station.name);
   $("#stationDialog #stationURL").val(station.url);
   $("#stationDialog").modal("show");
}

function newStationDialog() {
   $("#stationDialogTitle").text("Add Station");
   $("#stationDialog").removeAttr("data-id");
   $("#stationDialog").modal("show");
}

function loadStations(context) {
  var ids = context.stationStore.getIDs();
   
   for(var i = 0; i < ids.length; i++) {
      var station = context.stationStore.getStation(ids[i]);
      var tr = $("<tr>");
      $("<td>").html(station.name).appendTo(tr);
      $("<td>").html(station.url).appendTo(tr);
      
      tr.attr("id", station.id);
      tr.appendTo("#stationTable > tbody");
   }

   $("#stationTable tr").dblclick(function() {
      editStationDialog($(this).attr("id"));
   });

}

$(document).ready(function() {

   $(".nav a").click(function(event) {
      event.preventDefault();
   });

   getContext(function(ctx) {
      context = ctx;
      loadStations(context);   
   });

   $("#newStationButton").click(function() {
      newStationDialog();
   });

});
