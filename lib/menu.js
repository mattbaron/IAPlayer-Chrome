var MENU_STYLE = {
   border: "1px solid #eeeeee",
   background: "#ffffff",
   padding: "0px",
   position: "absolute",
   boxShadow: "3px 3px 10px #888"
};

var MENU_ITEM_STYLE = {
   padding: "10px 20px 10px 20px",
   fontSize: "13px"
};

///////////////////////////////////////////////////////////////////////////////
//
// Menu
//
///////////////////////////////////////////////////////////////////////////////
function Menu() {
   this.menuItems = new Array();
   this.menu;
   this.dataMap = {};
   this.data;
}

Menu.prototype.setData = function(key, value) {
   if (value === undefined) {
      this.data = key;
   } else {
      this.dataMap[key] = value;
   }
};

Menu.prototype.getData = function(key) {
   if (key === undefined) {
      return this.data;
   } else {
      return this.dataMap[key];
   }
};

Menu.prototype.addItem = function(label, callback) {
   var menuItem = new MenuItem(this, label, callback);
   this.menuItems.push(menuItem);
   return menuItem;
};

Menu.prototype.addSeparator = function() {
   this.menuItems.push(new MenuSeparator());
};

Menu.prototype.hide = function() {
   this.menu.hide();
};

Menu.prototype.destroy = function() {
   this.menu.hide();
   this.menu.remove();
};

Menu.prototype.createMenu = function() {
   this.menu = $("<div>");
   this.menu.css(MENU_STYLE);
   this.menu.appendTo(document.body);
};

Menu.prototype.show = function(event) {

   var _this = this;

   if (this.menu === undefined) {
      this.createMenu();

      this.menu.mouseleave(function() {
         _this.hide();
      });

      for (var i = 0; i < this.menuItems.length; i++) {
         this.menuItems[i].create().appendTo(this.menu);
      }

   }

   if (event.pageY > $(window).height() / 2) {

      this.menu.css({
         left: event.pageX - 10,
         top: (event.pageY - this.menu.height()) + 20
      });

   } else {
      this.menu.css({
         left: event.pageX - 10,
         top: event.pageY - 10
      });
   }

   // Show it
   this.menu.show();
};


///////////////////////////////////////////////////////////////////////////////
//
// Menu Item
//
///////////////////////////////////////////////////////////////////////////////

function MenuItem(menu, label, callback) {
   this.menu = menu;
   this.label = label;
   this.callback = callback;
}

MenuItem.prototype.setData = function(data) {
   this.data = data;
};

MenuItem.prototype.getData = function() {
   return this.data;
};

MenuItem.prototype.create = function() {

   var div = $("<div>");

   div.css(MENU_ITEM_STYLE);
   div.html(this.label);

   if(this.callback === undefined) {
      return div;
   }

   div.hover(function() {
      $(this).css("background", "#eeeeee");
   }, function() {
      $(this).css("background", "#ffffff");
   });

   var _this = this;

   div.click(function() {
      _this.callback.call(null, _this);
      _this.menu.hide();
   });

   return div;
};


///////////////////////////////////////////////////////////////////////////////
//
// Menu Separator
//
///////////////////////////////////////////////////////////////////////////////
function MenuSeparator() {

}

MenuSeparator.prototype.create = function() {
   var hr = $("<hr>");
   hr.css({ margin: "0px", padding: "0px", borderColor: "#eeeeee", color: "#eeeeee"});
   return hr;
};
