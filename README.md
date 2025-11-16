# Instagram Guess Who

## P2P Networking Notes

when creating room, create short uuid (e.g. 6 chars)
set id to be "username-uuid", hashed
display uuid to user to get their friend to use
friend will connect as "friend-uuid" and try to connect to "username-uuid" (both hashed)
upon connection, do handshake. say who you are and the uuid (or who the other person is and the uuid?)

UI: user fills in ig username of friend, logs in, gets mutuals, passes back to tab
UI: tab updates with create game and join game button, user clicks one of them
Create room flow:

- Generate random sequence for game code, create hash of own username and friend's username with UUID, open connection to peerserver
- show UUID to user as room code
- upon receiving connection, validate if their hash matches, and their sent username and UUID match. else terminate connection
- send own username and UUID. receive mutuals data
- find intersection of mutuals, send intersected mutuals back
- receive confirmation. close connection and start game

Join room flow:

- Enter room code to connect to friend's room
- create hash of own username and friend's username with room code, open connection to peerserver and connect to friend
- send username and UUID. if connection not terminated, receive and validate username and UUID. else terminate connection
- send mutuals data
- receive intersected mutuals. send confirmation.
- if connection closed, start game.

## Build
To build for each platform, update the manifest specified in `vite.config.js` and then run:

```bash
npm run build
```

Build *should* create a zip file of the dist folder `igw_build.zip` appropriately formatted for upload to web extension stores.

Add it to Chrome/Firefox extension, TODO link instructions
