import {Presence} from "phoenix"

export function renderMsg(messageObject) {
    const renderMsg = `<li class="collection-item">${messageObject.msg}</li>`;
    document.querySelector('.collection').innerHTML += renderMsg;
}

export function setUserItems(items) {
    document.getElementById("item").innerHTML = ""
    items.forEach(function(item) {
        document.getElementById("item").innerHTML += `<img id="item${item}" draggable="true" ondragstart="window.drag(event)" class="responsive-item" src="/images/${getImageName(item)}">`;
     })
}

export function getImageName(item) {
    switch(item) {
        case 1: return "square.png";
        case 2: return "circle.png";
        case 3: return "triangle.png";
        case 4: return "pentagon.png";
        case 5: return "hexagon.png";
        default: return "square.png";
     }
}

export function sendInputToServer(channel, user) {
    var msg = document.getElementById("inputTxt").value;
    channel.push('message:text', {msg: "Player " + user + " : " + msg})
    document.getElementById("inputTxt").value = "";
}

export function renderOnlineUsers(presences, me) {
  let onlineUsers = Presence.list(presences, (_id, {metas: [user, ...rest]}) => {
    return onlineUserTemplate(user, me);
  }).join("")

  document.querySelector("#online-users").innerHTML = onlineUsers;
}

const onlineUserTemplate = function(usr, me) {
    if(usr.user_id == me) return ``
    else {
      return `
        <div id="dropZone${usr.user_id}" class="dropzone" data-to-id="${usr.user_id}" ondrop="window.drop(event)" ondragover="window.allowDrop(event)">
          <p>Drag here to send to <strong>${usr.username}</strong></p>
        </div>
      `}

}