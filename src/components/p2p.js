import { Peer } from "peerjs";
/*
HELPERS
*/

// define room code parameters
const VALIDCHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LENGTH = 6;

// from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#basic_example
async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// adapted from https://stackoverflow.com/a/10727155
function generateRoomCode() {
  let result = "";
  for (let i = LENGTH; i > 0; --i)
    result += VALIDCHARS[Math.floor(Math.random() * VALIDCHARS.length)];
  return result;
}

async function roomInfo(roomCode, username, friend) {
  const userId = await sha256(`${username}${roomCode}`);
  const friendId = await sha256(`${friend}${roomCode}`);
  return { userId, friendId };
}

function validate(data, friend, roomCode) {
  return (
    data.username &&
    data.roomCode &&
    data.username === friend &&
    data.roomCode === roomCode
  );
}

/*
ROOM JOIN LOGIC
*/

export async function createRoom(
  profiles,
  setProfiles,
  username,
  friend,
  setStatus,
  setRoomCode,
  handleError
) {
  // create room code and get ids
  const roomCode = generateRoomCode();
  const { userId, friendId } = await roomInfo(roomCode, username, friend);

  // connect to PeerServer
  const peer = new Peer(userId);

  // error handling helper
  function createError(msg) {
    // clear room code
    setRoomCode("");
    // log and display error
    console.log(msg);
    handleError(msg);
    // close connection with peer
    peer.destroy();
  }
  try {
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      // only when connection initiated, display roomCode
      setRoomCode(roomCode);
    });

    // fired upon receiving connection, validate connection
    peer.on("connection", (conn) => {
      // if connection does not match expected id, close connection
      console.log(conn.peer);
      if (conn.peer !== friendId) conn.close();
      let stage = "validate";
      conn.on("data", (data) => {
        switch (stage) {
          // validate username and roomCode, else terminate connection
          case "validate": {
            if (!validate(data, friend, roomCode)) {
              conn.close();
              createError("validation of incoming connection failed");
              break;
            }

            // send own username and UUID
            conn.send({ username, roomCode });
            stage = "mutuals";
            break;
          }
          case "mutuals": {
            console.log(data);
            // receive mutuals data, determine intersection
            const filtered = profiles.filter((p) => data.includes(p.id));
            // send intersected mutuals back
            conn.send(filtered.map((p) => p.id));
            stage = "confirmation";
            setProfiles(filtered);
            break;
          }

          case "confirmation":
            if (data === "confirmation") {
              // confirmation of receipt. close connection
              conn.close();
              // change status to start game
              setStatus(4);
            }
            break;

          default:
            // theoretically unreachable case, throw an error
            createError("how did you reach this?");
            break;
        }
      });
    });
    // fired if peer encounters error
    peer.on("error", (err) => {
      createError(`${err.name}: ${err.mesage}`);
    });
  } catch (err) {
    createError(`${err.name}: ${err.mesage}`);
  }
}

export async function joinRoom(
  profiles,
  setProfiles,
  roomCode,
  username,
  friend,
  setStatus,
  handleError
) {
  const { userId, friendId } = await roomInfo(roomCode, username, friend);

  // connect to PeerServer
  const peer = new Peer(userId);

  // error handling helper
  function createError(msg) {
    // log and display error
    console.log(msg);
    handleError(msg);
    // close connection with peer
    peer.destroy();
  }
  try {
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      const conn = peer.connect(friendId);
      let stage = "validate";
      // send username and roomCode upon connection
      conn.on("open", () => {
        conn.send({ username, roomCode });
      });
      conn.on("data", (data) => {
        switch (stage) {
          case "validate":
            // receive and validate username and roomCode
            if (!validate(data, friend, roomCode)) {
              conn.close();
              createError("validation of incoming connection failed");
              break;
            }
            // send mutuals data
            stage = "mutuals";
            conn.send(profiles.map((p) => p.id));
            break;
          case "mutuals":
            // update profiles with intersected mutuals data
            setProfiles(profiles.filter((p) => data.includes(p.id)));
            console.log(data);
            // send confirmation
            stage = "confirmation";
            conn.send("confirmation");
            break;
          default:
            // theoretically unreachable case, throw an error
            createError("how did you reach this?");
            break;
        }
      });
      conn.on("close", () => {
        if (stage === "confirmation") {
          // start game
          setStatus(4);
        } else {
          // connection was closed prematurely, throw error
          createError(`connection was closed in stage ${stage}`);
        }
      });
    });
    peer.on("error", (err) => {
      createError(`${err.name}: ${err.message}`);
    });
  } catch (err) {
    createError(`${err.name}: ${err.message}`);
  }
}
