export function ProfileCard(props) {
    return <div
        className={`${props.profile.enabled
            ? "bg-blue-400 hover:bg-blue-200"
            : "bg-gray-200 hover:bg-gray-400"}
            p-4 rounded-md flex flex-col items-center cursor-pointer
            transition-all duration-200`}
        onClick={props.onClick}
    >
        <img alt={props.profile.username} src={props.profile.profile_pic} className={"rounded-full mb-1"}/>
        <a
            className={`underline ${props.profile.enabled
                ? "text-white hover:text-white"
                : "text-black hover:text-black"}`}
            href={`https://instagram.com/${props.profile.username}`}
            target={"_blank"}
        >
            {props.profile.username}
        </a>
        <p className={`${props.profile.enabled
            ? "text-white hover:text-white"
            : "text-black hover:text-black"}`}>{props.profile.full_name}</p>
    </div>;
}