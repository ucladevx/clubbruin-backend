### Game room chat:

refer to `utils/rooms/base-room.ts` for more

`onMessage("chat-send", ...)`
* client sends each new text to server
* server adds chat to local message history
* server sends the text back to client

`onMessage("chat-recv", ...)`
* server sends back to the client the text that was just sent

