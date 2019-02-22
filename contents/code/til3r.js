var clients = workspace.clientList();
var activeClient;

for (var i=0; i<clients.length; i++) {
    if (clients[i].active) {
      activeClient = clients[i];      
    }
}

workspace.clientActivated.connect(function(client){
  activeClient = client;
});

// function to check for valid clients taken from the tiling-kwin-script
// Copyright (C) 2012 Mathias Gottschlag <mgottschlag@gmail.com>
// Copyright (C) 2013-2014 Fabian Homborg <FHomborg@gmail.com>
var isIgnored = function(client) {
	// TODO: Add regex and more options (by title/caption, override a floater, maybe even a complete scripting language / code)
	// Application workarounds should be put here
	// HACK: Qt gives us a method-less QVariant(QStringList) if we ask for an array
	// Ask for a string instead (which can and should still be a StringList for the UI)
	var fl = "yakuake,krunner,plasma,plasma-desktop,plugin-container,Wine,klipper";
	// TODO: This could break if an entry contains whitespace or a comma - it needs to be validated on the qt side
	var floaters = String(readConfig("floaters", fl)).replace(/ /g,"").split(",");
	if (floaters.indexOf(client.resourceClass.toString()) > -1) {
		return true;
	}
	// HACK: Steam doesn't set the windowtype properly
	// Everything that isn't captioned "Steam" should be a dialog - these resize worse than the main window does
	// With the exception of course of the class-less update/start dialog with the caption "Steam" (*Sigh*)
	if (client.resourceClass.toString() == "steam" && client.caption != "Steam") {
		return true;
	} else if (client.resourceClass.toString() != "steam" && client.caption == "Steam") {
		return true;
	}
	if (client.specialWindow == true) {
		return true;
	}
	if (client.desktopWindow == true) {
		return true;
	}
	if (client.dock == true) {
		return true;
	}
	if (client.toolbar == true) {
		return true;
	}
	if (client.menu == true) {
		return true;
	}
	if (client.dialog == true) {
		return true;
	}
	if (client.splash == true) {
		return true;
	}
	if (client.utility == true) {
		return true;
	}
	if (client.dropdownMenu == true) {
		return true;
	}
	if (client.popupMenu == true) {
		return true;
	}
	if (client.tooltip == true) {
		return true;
	}
	if (client.notification == true) {
		return true;
	}
	if (client.comboBox == true) {
		return true;
	}
	if (client.dndIcon == true) {
		return true;
	}

    return false;
};

var resizeAndMove = function(column, row){
   if (isIgnored(activeClient)) {
     print("client ignored, no resize and move");
     return;
   }
  var wide = 1;
  if(column == 2){
      wide = 2;
  }

  var workGeo = workspace.clientArea(KWin.WorkArea, 1, 1);
  var geo = activeClient.geometry;
  geo.x = workGeo.x + (column - 1) * workGeo.width / 4;
  geo.width = wide * workGeo.width / 4;
  geo.y = workGeo.y;
  geo.height = workGeo.height;
  if (row > 0) {
    geo.y = workGeo.y + (row - 1) * workGeo.height / 2;
    geo.height = workGeo.height / 2;
  }

  print("new geometry, x: " + geo.x + " y: " + geo.y + " width: " + geo.width + " height: " + geo.height);
  activeClient.geometry = geo;
}

print("TIL3R active");

registerShortcut("UpperLeft", "Ultrawide: left quarter, full height", "Meta+Ctrl+Num+4", function () {resizeAndMove(1,0)});
registerShortcut("UpperMiddle", "Ultrawide: middle half, full height", "Meta+Ctrl+Num+5", function () {resizeAndMove(2,0)});
registerShortcut("UpperRight: right quarter, full height", "Ultrawide: right quarter, full height", "Meta+Ctrl+Num+6", function () {resizeAndMove(4,0)});
registerShortcut("FullLeft", "Ultrawide: left quarter, upper half", "Meta+Ctrl+Num+7", function () {resizeAndMove(1,1)});
registerShortcut("FullMiddle", "Ultrawide: middle half, upper half", "Meta+Ctrl+Num+8", function () {resizeAndMove(2,1)});
registerShortcut("FullRight", "Ultrawide: right quarter, upper half", "Meta+Ctrl+Num+9", function () {resizeAndMove(4,1)});
registerShortcut("LowerLeft", "Ultrawide: left quarter, lower half", "Meta+Ctrl+Num+1", function () {resizeAndMove(1,2)});
registerShortcut("LowerMiddle", "Ultrawide: middle half, lower half", "Meta+Ctrl+Num+2", function () {resizeAndMove(2,2)});
registerShortcut("LowerRight", "Ultrawide: right quarter, lower half", "Meta+Ctrl+Num+3", function () {resizeAndMove(4,2)});
