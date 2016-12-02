
$(document).ready(function() {

   getContext(function(context) {
      context.loadData(function(data) {
         $("#content").text(data.toString());
      });
   });

});
