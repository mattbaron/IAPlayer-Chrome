// options.js

var local = new Object();

function editStationDialog(id) {
   var station = local.context.stationStore.getStation(id);
   $("#stationDialogTitle").text("Edit Station");
   $("#stationDialog").attr("data-id", station.id);
   $("#stationDialog #stationName").val(station.name);
   $("#stationDialog #stationURL").val(station.url);
   $("#stationDialog").modal("show");
}

function newStationDialog() {
   $("#stationDialogTitle").text("Add Station");
   $("#stationDialog").removeAttr("data-id");
   $("#stationDialog #stationName").val("");
   $("#stationDialog #stationURL").val("");
   $("#stationDialog").modal("show");
}

function saveStation() {
   var id = $("#stationDialog").attr("data-id");

   if(id === undefined) {
      var station = {};
      station.url = $("#stationDialog #stationURL").val();
      station.name = $("#stationDialog #stationName").val();
      local.context.stationStore.add(station);
   } else {
      $("#stationDialog").modal("hide");
      var station  = local.context.stationStore.getStation(id);
      station.url = $("#stationDialog #stationURL").val();
      station.name = $("#stationDialog #stationName").val();
   }

   local.context.saveData();
   loadStations(local.context);
   $("#stationDialog").removeAttr("data-id");

}

function loadStations(context) {

   $("#stationTable tbody tr").remove();

   var ids = context.stationStore.getIDs();
   
   for(var i = 0; i < ids.length; i++) {
      var station = context.stationStore.getStation(ids[i]);

      var tr = $("<tr>").attr("id", station.id);

      $("<td>").html(station.name).appendTo(tr);
      $("<td>").html(station.url).appendTo(tr);

      tr.appendTo("#stationTable > tbody");
   }

   $("#stationTable tr").dblclick(function() {
      editStationDialog($(this).attr("id"));
   });

}

$(document).ready(function() {

   $(".nav a").click(function(event) {

   });

   getContext(function(ctx) {
      local.context = ctx;
      loadStations(local.context);
   });

   $("#newStationButton").click(function() {
      newStationDialog();
   });

   $("#saveStationButton").click(function() {
      saveStation();
      $("#stationDialog").modal("hide");
   });
});
