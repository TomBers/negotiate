import {Socket, Presence} from "phoenix"

import {renderMsg, setUserItems, renderOnlineUsers, sendInputToServer } from "./interface"

let presences = {};
let user = "";
let myItems = [];
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
    renderOnlineUsers(presences, user)
})

channel.on("presence_diff", diff => {
    presences = Presence.syncDiff(presences, diff)
    renderOnlineUsers(presences, user)
})


//Chat interface events

document.querySelector('button').addEventListener('click', function() {
    sendInputToServer(channel, user);
});

document.querySelector('#inputTxt').addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        sendInputToServer(channel, user);
    }
});

socket.sendItemTo = function (toId, item) {
    myItems = myItems.filter(e => e !== item);
    setUserItems(myItems);
    channel.push('message:text', {to: toId, item: item});
}

function parseTransfer(transfer) {
    if(transfer.from_id !== user && transfer.to_id === user) {
        myItems.push(transfer.item);
        setUserItems(myItems)
    }
}

export default socket
