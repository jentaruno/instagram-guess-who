export function FriendUsernameInputSection({
  isLoading,
  setFriend,
  handleClick,
}) {
  return (
    <div className={"flex flex-col items-center"}>
      <h2 className={"mb-2 text-lg"}>Friend's Instagram username:</h2>
      <input
        placeholder="user.name (no @)"
        className={
          "mb-4 px-4 py-2 text-lg text-black bg-gray-200 rounded-md focus:outline-none"
        }
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
          isLoading
            ? "bg-blue-300"
            : "bg-blue-500 hover:bg-blue-700 transition-all duration-200"
        } border-none text-lg text-white font-semibold py-2 px-4 rounded`}
        onClick={handleClick}
        disabled={isLoading}
        type="submit"
      >
        {!isLoading ? "Launch" : "Loading..."}
      </button>
      <br />
      Instagram Guess Who is independently developed, and is not affiliated with
      or endorsed or sponsored by Instagram, Facebook, or Meta.
    </div>
  );
}
