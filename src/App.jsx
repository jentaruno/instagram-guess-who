import { useState } from "react";
import findMutualFollowers from "./components/findMutualFollowers.js";
import { createRoom, joinRoom, validateRoomCode } from "./components/p2p.js";
import Game from "./components/Game.jsx";
import { FriendUsernameInputSection } from "./FriendUsernameInputSection.jsx";
import { CreateJoinRoomSection } from "./CreateJoinRoomSection.jsx";

export default function App() {
  const [friend, setFriend] = useState("");
  const [username, setUsername] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [friendRoomCode, setFriendRoomCode] = useState("");
  // status
  // 0 = new page
  // 1 = loaded mutuals
  // 4 = game start
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [peer, setPeer] = useState();
  const [conn, setConn] = useState();

  function handleClick() {
    setError("");
    setIsLoading(true);
    findMutualFollowers(friend, handleResponse, handleError);
  }

  function handleCreateRoom(mutuals, username) {
    setError("");
    setRoomCode("");
    createRoom(
      mutuals,
      setProfiles,
      username,
      friend,
      setStatus,
      setRoomCode,
      setPeer,
      setConn,
      updateProfiles,
      returnToMain,
      handleP2PError
    );
  }

  function handleJoinRoom() {
    if (!validateRoomCode(friendRoomCode.toUpperCase())) {
      setError("Error: invalid room code");
      return;
    }
    disconnectPeer();
    setIsLoading(true);
    joinRoom(
      profiles,
      setProfiles,
      friendRoomCode.toUpperCase(),
      username,
      friend,
      setStatus,
      setPeer,
      setConn,
      updateProfiles,
      returnToMain,
      handleP2PError
    );
  }

  function flipModal() {
    setShowModal(!showModal);
  }

  function handleError(data) {
    setIsLoading(false);
    setError(data);
  }

  function disconnectPeer() {
    // reset p2p connection
    peer && peer.destroy();
    setPeer();
    setConn();
  }

  function handleP2PError(data) {
    disconnectPeer();
    handleCreateRoom(profiles, username);
    handleError(data);
  }

  function updateProfiles(selections) {
    console.log(profiles);
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile, i) => {
        console.log(profile);
        return {
          ...profile,
          enabled: true,
          selected: selections[i],
        };
      })
    );
  }

  function handleResponse(mutuals, username) {
    // received mutuals data from instagram
    setUsername(username);
    setProfiles(mutuals);
    setError("");
    setIsLoading(false);
    handleCreateRoom(mutuals, username);
    setStatus(1);
  }

  function toggleCard(index) {
    setProfiles((prevProfiles) => {
      let numSelected = 0;
      return prevProfiles.map((profile) => {
        const newProfile =
          profile.selected && numSelected === index
            ? { ...profile, enabled: !profile.enabled }
            : profile;
        if (profile.selected) {
          numSelected += 1;
        }
        return newProfile;
      });
    });
  }

  function resetAll() {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) => {
        return { ...profile, enabled: true };
      })
    );
  }

  function returnToMain() {
    disconnectPeer();
    setError("");
    setRoomCode("");
    setFriendRoomCode("");
    setShowModal(false);
    setStatus(0);
    setUsername("");
    setFriend("");
    setProfiles([]);
    setIsLoading(false);
  }

  return (
    <>
      {status !== 4 ? (
        <div
          className={
            "w-full flex flex-col gap-4 items-center justify-center"
          }
        >
          <img
            alt={"Instagram Guess Who Logo"}
            src={"./logo-text.png"}
            className={"w-5/6 md:w-1/2"}
          />
          <div className={"flex gap-4 items-center"}>
            {status === 0 && (
              <FriendUsernameInputSection
                isLoading={isLoading}
                setFriend={setFriend}
                handleClick={handleClick}
              />
            )}
            {status === 1 && (
              <CreateJoinRoomSection
                isLoading={isLoading}
                handleBack={returnToMain}
                handleJoinRoom={handleJoinRoom}
                roomCode={roomCode}
                setFriendRoomCode={setFriendRoomCode}
              />
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <Game
          friend={friend}
          returnToMain={returnToMain}
          flipModal={flipModal}
          resetAll={resetAll}
          profiles={profiles}
          toggleCard={toggleCard}
          showModal={showModal}
          updateProfiles={updateProfiles}
          conn={conn}
        />
      )}
    </>
  );
}
