import {Socket, Presence} from "phoenix"

let presences = {};
let user = "";
let myItems = [];
let playerMap = new Map();
let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

let channel = socket.channel("room:messages", {})
channel.join()
  .receive("ok", resp => {
        console.log("Joined successfully", resp);
        user = resp.current_user_id;
        document.getElementById("userGreeting").innerHTML = "Welcome player " + user;
        myItems = resp.items;
        setUserItems(myItems);
   })
  .receive("error", resp => { console.log("Unable to join", resp) })

channel.on("message:new", renderMsg);

channel.on("message:transfer", parseTransfer)

channel.on("presence_state", state => {
    presences = Presence.syncState(presences, state)
    renderOnlineUsers(presences)
})

channel.on("presence_diff", diff => {
    presences = Presence.syncDiff(presences, diff)
    renderOnlineUsers(presences)
})

function setUserItems(items) {
    document.getElementById("item").innerHTML = ""
    items.forEach(function(item) {
        document.getElementById("item").innerHTML += `<img id="item${item}" draggable="true" ondragstart="window.drag(event)" class="responsive-item" src="/images/${getImageName(item)}">`;
     })
}

function getImageName(item) {
    switch(item) {
            case 1: return "square.png";
            case 2: return "circle.png";
            case 3: return "triangle.png";
            case 4: return "pentagon.png";
            case 5: return "hexagon.png";
            default: return "square.png";
        }
}


document.querySelector('button').addEventListener('click', function() {
    sendInputToServer(channel);
});

document.querySelector('#inputTxt').addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        sendInputToServer(channel);
    }
});


window.sendItemTo = function (toId, item) {
    myItems = myItems.filter(e => e !== item);
    setUserItems(myItems);
    channel.push('message:text', {to: toId, item: item});
}

function sendInputToServer(channel) {
    var msg = document.getElementById("inputTxt").value;
    channel.push('message:text', {msg: "Player " + user + " : " + msg})
    document.getElementById("inputTxt").value = "";
}

function renderMsg(messageObject) {
    const renderMsg = `<li class="collection-item">${messageObject.msg}</li>`;
    document.querySelector('.collection').innerHTML += renderMsg;
}

function parseTransfer(transfer) {
    if(transfer.from_id !== user && transfer.to_id === user) {
        myItems.push(transfer.item);
        setUserItems(myItems)
    }
}


const renderOnlineUsers = function(presences) {
  let onlineUsers = Presence.list(presences, (_id, {metas: [user, ...rest]}) => {
    return onlineUserTemplate(user);
  }).join("")

  document.querySelector("#online-users").innerHTML = onlineUsers;
}

const onlineUserTemplate = function(usr) {
      if(usr.user_id == user){
        return ``
       } else {
      return `
        <div id="dropZone${usr.user_id}" class="dropzone" data-to-id="${usr.user_id}" ondrop="window.drop(event)" ondragover="window.allowDrop(event)">
          <p>Drag here to send to <strong>${usr.username}</strong></p>
        </div>
      `}

}


export default socket
