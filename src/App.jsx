import {useState} from "react";
import findMutualFollowers from "./components/findMutualFollowers.js";
import {ProfileCard} from "./components/ProfileCard.jsx";
import {SelectionModal} from "./components/SelectionModal.jsx";
import {createRoom, joinRoom, validateRoomCode} from "./components/p2p.js";
import {BackButton} from "./components/BackButton.jsx";
import {FriendUsernameInputSection} from "./FriendUsernameInputSection.jsx";

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

  async function handleCreateRoom(username) {
    setError("");
    setIsLoading(true);

    await createRoom(
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
      handleP2PError
    );

    setIsLoading(false);
  }

  function handleJoinRoom() {
    if (!validateRoomCode(friendRoomCode)) {
      setError("Error: invalid room code");
      return;
    }
    setError("");
    setIsLoading(true);
    joinRoom(
      profiles,
      setProfiles,
      friendRoomCode,
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

  function handleP2PError(data) {
    // reset p2p connection
    peer && peer.destroy();
    setPeer();
    setConn();
    handleError(data);
  }

  function updateProfiles(selections) {
    setProfiles(
      profiles.map((profile, i) => ({
        ...profile,
        enabled: true,
        selected: selections[i],
      }))
    );
  }

  function handleResponse(mutuals, username) {
    // received mutuals data from instagram
    setUsername(username);
    setProfiles(mutuals);
    setError("");
    setIsLoading(false);
    handleCreateRoom(username);
    setStatus(1);
  }

  function toggleCard(index) {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile, i) =>
        i === index ? { ...profile, enabled: !profile.enabled } : profile
      )
    );
  }

  function resetAll() {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) => {
        return { ...profile, enabled: true };
      })
    );
  }

  function returnToMain() {
    handleP2PError("");
    setRoomCode("");
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
            "m-4 w-full flex flex-col gap-4 items-center justify-center"
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
                  handleClick={handleClick}/>
            )}
            {status === 1 && (
              <div className={"flex flex-col"}>
                <BackButton onClick={returnToMain} />
                <p>Have your friend join:</p>
                <h3>{roomCode}</h3>
                <p>Or join their room:</p>
                <div className={"flex flex-row"}>
                  <input
                      className={"h-8 border border-2 border-gray"}
                      type="text"
                      onChange={(event) => {
                        setFriendRoomCode(event.target.value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleJoinRoom();
                        }
                      }}
                      disabled={isLoading}
                  />
                  <button
                      className={`${
                          isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
                      } 
                          border-none text-white font-bold py-2 px-4 rounded`}
                      onClick={handleJoinRoom}
                      disabled={isLoading}
                      type="submit"
                  >
                    {!isLoading ? "Join" : "Joining..."}
                  </button>
                </div>
              </div>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <div className={"m-4 flex flex-col items-start"}>
          <div
            className={"mb-4 w-full flex flex-row justify-between items-center"}
          >
            <div className={"flex flex-row gap-4 items-center"}>
              <BackButton onClick={returnToMain} />
              <h1 className={"mb-1"}>Instagram Guess Who</h1>
              <p className={"mb-1 ml-2 text-lg text-gray-400"}>
                Playing with {friend}
              </p>
            </div>
            <button
              className={
                "bg-gray-200 hover:bg-gray-300 border-none text-[1rem] text-black"
              }
              onClick={flipModal}
            >
              Select Users
            </button>
            <button
              className={
                "bg-gray-200 hover:bg-gray-300 border-none text-[1rem] text-black"
              }
              onClick={resetAll}
            >
              Reset All
            </button>
          </div>
          <div className={"grid grid-cols-8 gap-4"}>
            {profiles
              .filter((profile) => profile.selected)
              .map((profile, i) => (
                <ProfileCard profile={profile} onClick={() => toggleCard(i)} />
              ))}
          </div>
          {showModal && (
            <SelectionModal
              profiles={profiles}
              updateProfiles={(selections) => {
                updateProfiles(selections);
                flipModal();
                conn.send(selections);
              }}
              flipModal={flipModal}
            />
          )}
        </div>
      )}
    </>
  );
}
