
$(document).ready(function() {

   getContext(function(context) {
      context.loadData(function(data) {
         $("#stationMap").html(JSON.stringify(data, null, 3));
      });
   });

});
