export function ProfileCard(props) {
  return (
    <div
      className={`${
        props.profile.enabled
          ? "bg-blue-400 dark:bg-blue-600"
          : "bg-neutral-200 dark:bg-neutral-500"
      }
            hover:-translate-y-1 p-4 rounded-md flex flex-col items-center cursor-pointer
            transition-all duration-200 relative group`}
      onClick={props.onClick}
    >
      <a
        className={`absolute top-2 left-2 invisible hover:text-blue-300 group-hover:visible ${
          props.profile.enabled ? "text-white" : "text-black"
        }`}
        href={`https://instagram.com/${props.profile.username}`}
        target={"_blank"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
          />
          <path
            fillRule="evenodd"
            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
          />
        </svg>
      </a>
      <img
        alt={props.profile.username}
        src={props.profile.profile_pic}
        className={"rounded-full mb-1"}
      />
      <p
        className={`text-center line-clamp-1 ${
          props.profile.enabled ? "text-white" : "text-black dark:text-white"
        }`}
      >
        {props.profile.username}
      </p>
      <p
        className={`text-center line-clamp-1 ${
          props.profile.enabled ? "text-white" : "text-black dark:text-white"
        }`}
      >
        {props.profile.full_name}
      </p>
    </div>
  );
}
