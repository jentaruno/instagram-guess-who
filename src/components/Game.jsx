import { useEffect, useRef, useState } from "react";
import { ProfileCard } from "./ProfileCard.jsx";
import { SelectionModal } from "./SelectionModal.jsx";
import { BackButton } from "./BackButton.jsx";
import { HelpModal } from "./HelpModal.jsx";
import { QuestionModal } from "./QuestionModal.jsx";
import { LiaUserEditSolid } from "react-icons/lia";
import { PiDiceThree } from "react-icons/pi";
import { TbReload } from "react-icons/tb";
import { BsQuestionCircle } from "react-icons/bs";

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
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickAway = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("pointerdown", handleClickAway);
    return () => document.removeEventListener("pointerdown", handleClickAway);
  }, []);

  const showMoreButton = (
    <div className="relative inline-block" ref={menuRef}>
      <button
        className={
          "p-0 border-none focus:outline-none bg-transparent align-middle"
        }
        onClick={() => setShowMoreMenu(!showMoreMenu)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-three-dots"
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
              onClick={() => {
                setShowSelectionModal(true);
                setShowMoreMenu(false);
              }}
            >
              <LiaUserEditSolid size={24} />
              Select Users
            </a>
            <a
              className="flex flex-row gap-2 block px-4 py-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white"
              role="menuitem"
              onClick={() => {
                setShowQuestionModal(true);
                setShowMoreMenu(false);
              }}
            >
              <PiDiceThree size={24} />
              Random Question
            </a>
            <a
              className="flex flex-row gap-2 block px-4 py-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white"
              role="menuitem"
              onClick={() => {
                resetAll();
                setShowMoreMenu(false);
              }}
            >
              <TbReload size={24} />
              Reset All
            </a>
          </div>
        </div>
      )}
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
    </div>
  );

  const helpButton = (
    <>
      <button
        className={"p-0 border-none focus:outline-none bg-transparent"}
        onClick={() => setShowHelpModal(true)}
      >
        <BsQuestionCircle size={24} />
      </button>
      {showHelpModal && <HelpModal hideModal={() => setShowHelpModal(false)} />}
    </>
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
              className={"h-16 ml-2 md:ml-0"}
            />
          </div>
          <p className={"mb-1 ml-2 text-lg text-gray-400"}>
            Playing with {friend}
          </p>
        </div>
        <div className={"flex flex-row gap-4 md:items-center"}>
          {showMoreButton}
          {helpButton}
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
    </div>
  );
}
