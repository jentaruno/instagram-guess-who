import { useState } from "react";
import { ProfileCard } from "./ProfileCard.jsx";
import { SelectionModal } from "./SelectionModal.jsx";
import { BackButton } from "./BackButton.jsx";
import { HelpModal } from "./HelpModal.jsx";
import { QuestionModal } from "./QuestionModal.jsx";
import { LiaUserEditSolid } from "react-icons/lia";
import { PiDiceThree } from "react-icons/pi";
import { TbReload } from "react-icons/tb";

export default function Game({
  friend,
  returnToMain,
  resetAll,
  profiles,
  updateProfiles,
  conn,
  toggleCard,
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const showMoreButton = (
    <div className="relative inline-block">
      <button
        className={"p-0 border-none focus:outline-none bg-transparent"}
        onClick={() => setShowMoreMenu(!showMoreMenu)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-three-dots"
          viewBox="0 0 16 16"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
        </svg>
      </button>
      {showMoreMenu && (
        <div
          className="origin-top-right absolute right-0 z-10 mt-2 w-56
                    rounded-md shadow-lg bg-white dark:bg-gray-800 focus:outline-none"
          role="menu"
        >
          <div className="py-1" role="none">
            <a
              className="flex flex-row gap-2 block px-4 py-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white"
              role="menuitem"
            >
              <LiaUserEditSolid size={24} />
              Select Users
            </a>
            <a
              className="flex flex-row gap-2 block px-4 py-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white"
              role="menuitem"
            >
              <PiDiceThree size={24} />
              Random Question
            </a>
            <a
              className="flex flex-row gap-2 block px-4 py-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white"
              role="menuitem"
            >
              <TbReload size={24} />
              Reset All
            </a>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={"m-4 flex flex-col items-start"}>
      <div
        className={
          "mb-4 w-full flex flex-col md:flex-row justify-between items-center"
        }
      >
        <div className={"flex flex-col md:flex-row md:gap-4 items-center"}>
          <div className={"flex flex-row md:contents mb-2"}>
            <BackButton onClick={returnToMain} />
            <img
              alt={"Instagram Guess Who Logo"}
              src={"./logo-oneline.png"}
              className={"w-5/6 ml-2 md:ml-0 md:w-1/2"}
            />
          </div>
          <p className={"mb-1 ml-2 text-lg text-gray-400"}>
            Playing with {friend}
          </p>
        </div>
        <div className={"flex flex-row gap-4 md:items-center"}>
          {showMoreButton}
          <button
            className={"p-0 border-none focus:outline-none bg-transparent"}
            onClick={() => setShowHelpModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-question-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
            </svg>
          </button>
          <button
            className={
              "w-24 mb-2 bg-gray-200 hover:bg-gray-300 border-none text-[1rem] text-black"
            }
            onClick={() => setShowSelectionModal(true)}
          >
            Select Users
          </button>
          <button
            className={
              "w-24 mb-2 bg-gray-200 hover:bg-gray-300 border-none text-[1rem] text-black"
            }
            onClick={() => setShowQuestionModal(true)}
          >
            Random Question
          </button>
          <button
            className={
              "w-24 mb-2 bg-gray-200 hover:bg-gray-300 border-none text-[1rem] text-black"
            }
            onClick={resetAll}
          >
            Reset All
          </button>
        </div>
      </div>
      <div
        className={
          "grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4"
        }
      >
        {profiles
          .filter((profile) => profile.selected)
          .map((profile, i) => (
            <ProfileCard
              key={i}
              profile={profile}
              onClick={() => toggleCard(i)}
            />
          ))}
      </div>
      {showSelectionModal && (
        <SelectionModal
          profiles={profiles}
          updateProfiles={(selections) => {
            updateProfiles(selections);
            setShowSelectionModal(false);
            conn.send(selections);
          }}
          hideModal={() => setShowSelectionModal(false)}
        />
      )}
      {showQuestionModal && (
        <QuestionModal hideModal={() => setShowQuestionModal(false)} />
      )}
      {showHelpModal && <HelpModal hideModal={() => setShowHelpModal(false)} />}
    </div>
  );
}
