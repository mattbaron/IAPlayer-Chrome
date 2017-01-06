// options.js

var local = new Object();

function editStationDialog(context, id) {
   var station = context.stationStore.getStation(id);
   $("#stationDialogTitle").text("Edit Station");
   $("#stationDialog").attr("data-id", station.id);
   $("#stationDialog #stationName").val(station.name);
   $("#stationDialog #stationURL").val(station.url);
   $("#stationDialog").modal("show");
}

function newStationDialog(context) {
   $("#stationDialogTitle").text("Add Station");
   $("#stationDialog").removeAttr("data-id");
   $("#stationDialog #stationName").val("");
   $("#stationDialog #stationURL").val("");
   $("#stationDialog").modal("show");
}

function saveStation(context) {

   var id = $("#stationDialog").attr("data-id");

   if (id === undefined) {
      var station = {};
      station.url = $("#stationDialog #stationURL").val();
      station.name = $("#stationDialog #stationName").val();
      context.stationStore.add(station);
   } else {
      $("#stationDialog").modal("hide");
      var station = context.stationStore.getStation(id);
      station.url = $("#stationDialog #stationURL").val();
      station.name = $("#stationDialog #stationName").val();
   }

   context.saveData();
   loadStations(context);

   $("#stationDialog").removeAttr("data-id");

}

function getSelection() {
   var selection = new Array();

   $("#stationTable tr.station-selected").each(function() {
      selection.push($(this).attr("id"));
   });

   return selection;
}

function clearSelection() {
   $("#stationTable tr").removeClass("station-selected");
   $("#deleteStationButton").hide();
}

function deleteStations(context, stations) {
   stations.forEach(function(id) {
      console.log(id);
      context.stationStore.delete(id);
   });
   context.saveData();
   clearSelection();
   loadStations(context);
}

function loadStations(context) {

   $("#stationTable tbody tr").remove();

   var ids = context.stationStore.getIDs();

   for (var i = 0; i < ids.length; i++) {
      var station = context.stationStore.getStation(ids[i]);

      var tr = $("<tr>").attr("id", station.id).attr("data-station-id", station.id);

      $("<td>").html(station.name).appendTo(tr);
      $("<td>").html(station.url).appendTo(tr);

      tr.appendTo("#stationTable > tbody");
   }

   $("#stationTable tr").dblclick(function() {
      editStationDialog(context, $(this).attr("id"));
   });

   $("#stationTable tr[data-station-id]").click(function() {

      if($(this).hasClass("station-selected")) {
         $(this).removeClass("station-selected");
      } else {
         $(this).addClass("station-selected");
      }

      var selection = getSelection();

      if(selection.length > 0) {
         $("#deleteStationButton").show();
      } else {
         $("#deleteStationButton").hide();
      }

   });

}

function init(context) {

   loadStations(context);

   $("#newStationButton").click(function() {
      newStationDialog(context);
   });

   $("#deleteStationButton").click(function() {
      deleteStations(context, getSelection());
   });

   $("#saveStationButton").click(function() {
      saveStation(context);
      $("#stationDialog").modal("hide");
   });

   $("#stationDialog").on("shown.bs.modal", function () {
      $("#stationName").focus();
   });


}

$(document).ready(function() {

   getContext(function(context) {
      local.context = context;
      init(context);
   });

   $(document).keyup(function(event) {
      if (event.keyCode === 27) {
         clearSelection();
      }
   });

});
