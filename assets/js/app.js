// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".


import socket from "./socket"

// Drag and drop functions

window.allowDrop = function (ev) {
    ev.preventDefault();
}

window.drag = function (ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

window.drop = function (ev) {
    ev.preventDefault();
    const to = ev.currentTarget.dataset.toId;
    const item_id = ev.dataTransfer.getData("text").replace("item", "");
    socket.sendItemTo(to, parseInt(item_id, 10));
}

