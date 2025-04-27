export function SelectionProfileCard({
  index,
  profile,
  isSelected,
  toggleSelection,
}) {
  return (
    <div
      key={index}
      className="flex flex-row h-[50px] items-center p-2 bg-blue-500 rounded-md"
      onClick={() => toggleSelection(index)}
    >
      <img
        alt={profile.username}
        src={profile.profile_pic}
        className="rounded-full object-scale-down max-h-full mr-2"
      />
      <span className="flex flex-col max-w-24">
        <a
          className={`text-sm text-left text-white hover:text-white hover:underline truncate`}
          href={`https://instagram.com/${profile.username}`}
          target={"_blank"}
          onClick={(e) => e.stopPropagation()}
        >
          {profile.username}
        </a>
        <a
          className={`text-sm text-left text-white hover:text-white hover:underline truncate`}
          href={`https://instagram.com/${profile.username}`}
          target={"_blank"}
          onClick={(e) => e.stopPropagation()}
        >
          {profile.full_name}
        </a>
      </span>
      <div className="ml-auto relative">
        <label className="flex items-center cursor-pointer relative">
          <input
            type="checkbox"
            checked={isSelected}
            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-full
                hover:bg-white hover:bg-opacity-50
                bg-transparent border-2 border-white checked:bg-white checked:focus:bg-white checked:hover:bg-white
                focus:ring-0 focus:ring-offset-0"
            id="check"
          />
          <span className="absolute text-blue-500 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
      </div>
    </div>
  );
}
