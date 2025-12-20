import { useState } from "react";
import { BaseModal } from "./BaseModal.jsx";

export function RandomFollowerModal({ profiles, hideModal }) {
  console.log(profiles);
  const getRandom = (arr, exclude) => {
    let q;
    do {
      q = arr[Math.floor(Math.random() * arr.length)];
    } while (q === exclude);
    return q;
  };

  const rollFollower = () =>
    setRandomFollower((prev) => getRandom(profiles, prev));

  const [randomFollower, setRandomFollower] = useState(() =>
    getRandom(profiles)
  );

  return (
    <BaseModal title="Random Follower Selector" hideModal={hideModal}>
      <div className="flex flex-col items-center space-y-4 mb-6 pr-2">
        <p className="text-lg">Your person this round is...</p>
        <div className="flex flex-col items-center py-4">
          <img
            alt={randomFollower.username}
            src={randomFollower.profile_pic}
            className={"rounded-full mb-1"}
          />
          <p className={"text-center line-clamp-1 text-black dark:text-white"}>
            {randomFollower.username}
          </p>
          <p className={"text-center line-clamp-1 text-black dark:text-white"}>
            {randomFollower.full_name}
          </p>
        </div>
        <button
          type="button"
          onClick={rollFollower}
          className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2
                text-sm font-semibold text-gray-900 shadow-xs bg-gray-200 hover:bg-gray-300
                border-none hover:border-none sm:mt-0 sm:w-auto
                transition-all duration-200"
        >
          <span className="text-lg font-medium">Randomize</span>
        </button>
      </div>
    </BaseModal>
  );
}
