import { useState } from "react";
import findMutualFollowers from "./components/findMutualFollowers.js";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { SelectionModal } from "./components/SelectionModal.jsx";
import { createRoom, joinRoom } from "./components/p2p.js";
import { BackButton } from "./components/BackButton.jsx";

export default function App() {
  const [friend, setFriend] = useState("");
  const [username, setUsername] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  // status
  // 0 = new page
  // 1 = loaded mutuals
  // 2 = createRoom
  // 3 = joinRoom
  // 4 = game start
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    setIsLoading(true);
    findMutualFollowers(friend, handleResponse, handleError);
  }

  function handleRoomBack() {
    setError("");
    setRoomCode("");
    setStatus(1);
  }

  function handleCreateRoom() {
    setError("");
    setIsLoading(true);
    createRoom(
      profiles,
      setProfiles,
      username,
      friend,
      setStatus,
      setRoomCode,
      handleError
    );
  }

  function handleJoinRoom() {
    setError("");
    setIsLoading(true);
    joinRoom(
      profiles,
      setProfiles,
      roomCode,
      username,
      friend,
      setStatus,
      handleError
    );
  }

  function flipModal() {
    setShowModal(!showModal);
  }

  function handleError(data) {
    setIsLoading(false);
    setError(data);
  }

  function handleResponse(mutuals, username) {
    // received mutuals data from instagram
    setUsername(username);
    setProfiles(
      mutuals.map((e, i) => {
        return { ...e, selected: i < 24, enabled: true };
      })
    );
    setError("");
    setIsLoading(false);
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
          <h1>Instagram Guess Who</h1>
          <div className={"flex gap-4 items-center"}>
            {status === 0 && (
              <>
                <input
                  className={"h-8 border border-2 border-gray"}
                  type="text"
                  onChange={(event) => {
                    setFriend(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleClick();
                    }
                  }}
                  disabled={isLoading}
                />
                <button
                  className={`${
                    isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
                  } 
                        border-none text-white font-bold py-2 px-4 rounded`}
                  onClick={handleClick}
                  disabled={isLoading}
                  type="submit"
                >
                  {!isLoading ? "Launch" : "Loading..."}
                </button>
              </>
            )}
            {status === 1 && (
              <>
                <BackButton onClick={returnToMain} />
                <button
                  className="bg-blue-500"
                  onClick={() => {
                    setStatus(2);
                    handleCreateRoom();
                  }}
                >
                  Create Room
                </button>
                <button
                  className="bg-blue-500"
                  onClick={() => {
                    setStatus(3);
                  }}
                >
                  Join Room
                </button>
              </>
            )}
            {status === 2 && (
              <>
                <BackButton onClick={handleRoomBack} />
                <p>Room code: {roomCode}</p>
              </>
            )}
            {status === 3 && (
              <>
                <BackButton onClick={handleRoomBack} />
                <input
                  className={"h-8 border border-2 border-gray"}
                  type="text"
                  onChange={(event) => {
                    setRoomCode(event.target.value);
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
              </>
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
              setProfiles={setProfiles}
              flipModal={flipModal}
            />
          )}
        </div>
      )}
    </>
  );
}
