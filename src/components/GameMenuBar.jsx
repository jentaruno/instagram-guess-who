import { useEffect, useRef, useState } from "react";
import { SelectionModal } from "./modals/SelectionModal.jsx";
import { HelpModal } from "./modals/HelpModal.jsx";
import { QuestionModal } from "./modals/QuestionModal.jsx";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbMessageQuestion, TbReload, TbUserQuestion } from "react-icons/tb";
import { BsQuestionCircle } from "react-icons/bs";
import { RandomFollowerModal } from "./modals/RandomFollowerModal.jsx";
import { AiOutlineFullscreen } from "react-icons/ai";

export default function GameMenuBar({
  profiles,
  updateProfiles,
  conn,
  resetAll,
  toggleFullscreen,
}) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showRandomFollowerModal, setShowRandomFollowerModal] = useState(false);
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

  const fullscreenButton = (
    <button
      className={
        "p-0 border-none focus:outline-none bg-transparent hover:scale-110 transition-all duration-200"
      }
      onClick={toggleFullscreen}
      aria-label="Toggle Fullscreen"
    >
      <AiOutlineFullscreen size={24} />
    </button>
  );

  const randomQuestionButton = (
    <button
      className={
        "p-0 border-none focus:outline-none bg-transparent hover:scale-110 transition-all duration-200"
      }
      onClick={() => setShowQuestionModal(true)}
      aria-label="Random Question"
    >
      <TbMessageQuestion size={24} />
    </button>
  );

  const helpButton = (
    <button
      className={
        "p-0 border-none focus:outline-none bg-transparent hover:scale-110 transition-all duration-200"
      }
      onClick={() => setShowHelpModal(true)}
      aria-label="Help"
    >
      <BsQuestionCircle size={24} />
    </button>
  );

  const showMoreButton = (
    <div className="relative inline-block" ref={menuRef}>
      <button
        className={
          "p-0 border-none focus:outline-none bg-transparent align-middle hover:scale-110 transition-all duration-200"
        }
        onClick={() => setShowMoreMenu(!showMoreMenu)}
        aria-haspopup="menu"
        aria-expanded={showMoreMenu}
        aria-label="More"
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
          className="origin-top-right absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-neutral-700 focus:outline-none"
          role="menu"
        >
          <div className="p-2" role="none">
            <a
              className="flex flex-row gap-2 block p-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-neutral-600 rounded-md"
              role="menuitem"
              onClick={() => {
                setShowSelectionModal(true);
                setShowMoreMenu(false);
              }}
            >
              <LiaUserEditSolid size={24} />
              Select Followers
            </a>
            <a
              className="flex flex-row gap-2 block p-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-neutral-600 rounded-md"
              role="menuitem"
              onClick={() => {
                setShowRandomFollowerModal(true);
                setShowMoreMenu(false);
              }}
            >
              <TbUserQuestion size={24} />
              Random Follower
            </a>
            <a
              className="flex flex-row gap-2 block p-2 cursor-pointer text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-neutral-600 rounded-md"
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
    </div>
  );

  return (
    <div className="relative">
      <div className={"flex flex-row gap-4 md:items-center"}>
        {fullscreenButton}
        {randomQuestionButton}
        {helpButton}
        {showMoreButton}
      </div>
      {showHelpModal && <HelpModal hideModal={() => setShowHelpModal(false)} />}
      {showQuestionModal && (
        <QuestionModal hideModal={() => setShowQuestionModal(false)} />
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
      {showRandomFollowerModal && (
        <RandomFollowerModal
          profiles={profiles.filter((profile) => profile.selected)}
          hideModal={() => setShowRandomFollowerModal(false)}
        />
      )}
    </div>
  );
}
