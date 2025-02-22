export function FriendUsernameInputSection({isLoading, setFriend, handleClick}) {
    return <>
        <p>Friend's Instagram username:</p>
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
            className={`${isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
            } 
                        border-none text-white font-bold py-2 px-4 rounded`}
            onClick={handleClick}
            disabled={isLoading}
            type="submit"
        >
            {!isLoading ? "Launch" : "Loading..."}
        </button>
    </>;
}