import { BackButton } from "./components/BackButton.jsx";

export function CreateJoinRoomSection({
  isLoading,
  handleBack,
  handleJoinRoom,
  roomCode,
  setFriendRoomCode,
  error,
}) {
  return (
    <div className={"flex flex-row items-start gap-4"}>
      <BackButton onClick={handleBack} />
      <div className={"flex flex-col items-center"}>
        <p className={"text-lg"}>Have your friend join:</p>
        <h2 className={"text-3xl font-bold mb-4"}>{roomCode}</h2>
        <p className={"mb-2 text-lg"}>Or join their room:</p>
        <input
          className={
            "mb-4 px-4 py-2 text-lg text-black bg-gray-200 rounded-md focus:outline-none"
          }
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
          className={`text-lg ${
            isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
          } 
                              border-none text-white font-semibold py-2 px-4 rounded`}
          onClick={handleJoinRoom}
          disabled={isLoading}
          type="submit"
        >
          {!isLoading ? "Join" : "Joining..."}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
