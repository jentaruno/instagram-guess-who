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
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// adapted from https://stackoverflow.com/a/10727155
function generateRoomCode() {
  let result = "";
  for (let i = LENGTH; i > 0; --i)
    result += VALIDCHARS[Math.floor(Math.random() * VALIDCHARS.length)];
  return result;
}

export function validateRoomCode(roomCode) {
  return (
    roomCode.length === LENGTH &&
    ![...roomCode].some((c) => !VALIDCHARS.includes(c))
  );
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

function setFirstMutuals(profiles, data, setProfiles) {
  const filteredProfiles = profiles.filter((p) => data.includes(p.id));
  const selectedProfiles = filteredProfiles.map((e, i) => {
    return { ...e, selected: i < 24, enabled: true };
  });
  setProfiles(selectedProfiles);
  return selectedProfiles;
}

function handleConnClose(stage, handleError) {
  if (stage !== "playing") {
    // connection was closed prematurely, throw error
    handleError(`connection was closed in stage ${stage}`);
  }
  console.log("closed connection");
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
  setPeer,
  setConn,
  updateProfiles,
  returnToMain,
  handleError
) {
  function _handleErr(err) {
    console.log({ err });
    handleError(`${err.name}: ${err.message}`);
  }
  // create room code and get ids
  const roomCode = generateRoomCode();
  console.log("Creating room...");
  console.log("Room ", roomCode);
  console.log("Username ", username);
  console.log("Friend ", friend);
  const { userId, friendId } = await roomInfo(roomCode, username, friend);

  // connect to PeerServer
  const peer = new Peer(userId);
  setPeer(peer);

  try {
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      // only when connection initiated, display roomCode
      setRoomCode(roomCode);
    });

    // fired upon receiving connection, validate connection
    peer.on("connection", (conn) => {
      setConn(conn);
      // if connection does not match expected id, close connection
      console.log(conn.peer);
      if (conn.peer !== friendId) conn.close();
      let stage = "validate";
      conn.on("error", _handleErr);
      conn.on("data", (data) => {
        switch (stage) {
          // validate username and roomCode, else terminate connection
          case "validate": {
            if (!validate(data, friend, roomCode)) {
              conn.close();
              handleError("validation of incoming connection failed");
              break;
            }

            // send own username and roomCode
            conn.send({ username, roomCode });
            stage = "mutuals";
            break;
          }
          case "mutuals": {
            // receive mutuals data, determine intersection
            const filtered = setFirstMutuals(profiles, data, setProfiles);
            // send intersected mutuals back
            conn.send(filtered.map((p) => p.id));
            stage = "confirmation";
            setProfiles(filtered);
            break;
          }

          case "confirmation":
            if (data === "confirmation") {
              // receipt confirmation, start game
              setStatus(4);
              stage = "playing";
            }
            break;

          case "playing":
            updateProfiles(data);
            break;

          default:
            // theoretically unreachable case, throw an error
            handleError("how did you reach this?");
            break;
        }
      });
      conn.on("close", () => {
        handleConnClose(stage, handleError);
        if (stage === "playing") {
          returnToMain();
        }
      });

      // fired if peer encounters error
      peer.on("error", _handleErr);
    });
  } catch (err) {
    _handleErr(err);
  }
}

export async function joinRoom(
  profiles,
  setProfiles,
  roomCode,
  username,
  friend,
  setStatus,
  peer,
  setPeer,
  setConn,
  updateProfiles,
  returnToMain,
  handleError
) {
  console.log("Joining...");
  console.log("Room ", roomCode);
  console.log("Username ", username);
  console.log("Friend ", friend);
  const { userId, friendId } = await roomInfo(roomCode, username, friend);

  function _handleErr(err) {
    console.log({ err });
    if (err.type === "peer-unavailable") {
      handleError("Error: Could not connect. Is the room code correct?");
    } else {
      handleError(`${err.name}: ${err.message}`);
    }
    peer.destroy();
    setPeer();
  }

  try {
    // connect to PeerServer
    const conn = peer.connect(friendId);
    setConn(conn);
  } catch (err) {
    _handleErr(err);
  }
}
