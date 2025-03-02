import { ProfileCard } from "./ProfileCard.jsx";
import { SelectionModal } from "./SelectionModal.jsx";
import { BackButton } from "./BackButton.jsx";

export default function Game({
  friend,
  returnToMain,
  flipModal,
  resetAll,
  profiles,
  showModal,
  updateProfiles,
  conn,
}) {
  return (
    <div className={"m-4 flex flex-col items-start"}>
      <div className={"mb-4 w-full flex flex-row justify-between items-center"}>
        <div className={"flex flex-row gap-4 items-center"}>
          <BackButton onClick={returnToMain} />
          <img
            alt={"Instagram Guess Who Logo"}
            src={"./logo-oneline.png"}
            className={"w-5/6 md:w-1/2"}
          />
          <p className={"mb-1 ml-2 text-lg text-gray-400"}>
            Playing with {friend}
          </p>
        </div>
        <div>
          <button
            className={
              "mr-4 mb-2 bg-gray-200 hover:bg-gray-300 border-none text-[1rem] text-black"
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
  );
}
