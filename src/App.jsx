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
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleClick}
                        disabled={isLoading}
                    >
                        Launch
                    </button>
                    {isLoading && <p>Loading...</p>}
                </div>
        </div>
        : <div className={"m-4 flex flex-col items-start"}>
            <div className={"mb-4 w-full flex flex-row justify-between items-center"}>
                <h1>Instagram Guess Who</h1>
                <button className={"bg-gray-200 hover:bg-gray-300 outline-none text-[1rem]"} onClick={() => resetAll()}>
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