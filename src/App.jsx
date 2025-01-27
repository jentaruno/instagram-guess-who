import {useState} from "react";
import findMutualFollowers from "./components/findMutualFollowers.js";
import {ProfileCard} from "./components/ProfileCard.jsx";

export default function App() {
  const [username, setUsername] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [isGaming, setIsGaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
      setIsLoading(true);
      findMutualFollowers(username, handleResponse);
  }

  function handleResponse(data) {
      let newProfiles = data
          .slice(0, 24)
          .map(e => { return {...e, enabled: true} });
      setProfiles(newProfiles);
      setIsLoading(false);
      setIsGaming(true);
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
                return {...profile, enabled: true}
            })
        )
    }

    function returnToMain() {
        setIsGaming(false);
        setUsername("");
        setProfiles([]);
        setIsLoading(false);
    }

    return (
    <>
        {!isGaming
        ? <div className={"m-4 w-full flex flex-col gap-4 items-center justify-center"}>
                <h1>Instagram Guess Who</h1>
                <div className={"flex gap-4 items-center"}>
                    <input
                        className={"h-8 border border-2 border-gray"}
                        type="text"
                        onChange={(event) => {
                        setUsername(event.target.value);
                        }}
                        disabled={isLoading}
                    />
                    <button
                        className={`${isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"} 
                        border-none text-white font-bold py-2 px-4 rounded`}
                        onClick={handleClick}
                        disabled={isLoading}
                    >
                        {!isLoading ? "Launch" : "Loading..."}
                    </button>
                </div>
        </div>
        : <div className={"m-4 flex flex-col items-start"}>
            <div className={"mb-4 w-full flex flex-row justify-between items-center"}>
                <div className={"flex flex-row gap-4 items-center"}>
                    <button className={"p-0 border-none"} onClick={returnToMain}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </button>
                    <h1 className={"mb-1"}>Instagram Guess Who</h1>
                    <p className={"mb-1 ml-2 text-lg text-gray-400"}>Playing with {username}</p>
                </div>
                <button className={"bg-gray-200 hover:bg-gray-300 border-none text-[1rem]"} onClick={() => resetAll()}>
                    Reset All
                </button>
            </div>
            <div className={"grid grid-cols-8 gap-4"}>
                {profiles.map((profile, i) =>
                    <ProfileCard profile={profile} onClick={() => toggleCard(i)}/>
                )}
            </div>
            </div>
        }
    </>
  );
}