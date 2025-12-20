import { ProfileCard } from "./ProfileCard.jsx";
import { BackButton } from "./BackButton.jsx";
import GameMenuBar from "./GameMenuBar.jsx";

export default function Game({
  friend,
  returnToMain,
  resetAll,
  profiles,
  updateProfiles,
  conn,
  toggleCard,
}) {
  const toggleFullscreen = () => {
    const video = document.documentElement;
    if (!document.fullscreenElement) video.requestFullscreen();
    else document.exitFullscreen?.();
  };

  return (
    <div className={"m-4 flex flex-col items-start"}>
      <div
        className={
          "mb-4 w-full flex flex-col md:flex-row justify-between items-center"
        }
      >
        <div className={"flex flex-col md:flex-row md:gap-4 items-center"}>
          <div className={"flex flex-row md:contents mb-2"}>
            <BackButton
              onClick={() => {
                returnToMain();
                document.exitFullscreen?.();
              }}
            />
            <img
              alt={"Instagram Guess Who Logo"}
              src={"./logo-oneline.png"}
              className={"h-16 ml-2 md:ml-0"}
            />
          </div>
          <p className={"mb-1 ml-2 text-lg text-neutral-400"}>
            Playing with{" "}
            <a href={"https://instagram.com/" + friend} target="_blank">
              {friend}
            </a>
          </p>
        </div>
        <GameMenuBar
          profiles={profiles}
          updateProfiles={updateProfiles}
          conn={conn}
          resetAll={resetAll}
          toggleFullscreen={toggleFullscreen}
        />
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
