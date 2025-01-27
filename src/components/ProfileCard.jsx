export function ProfileCard(props) {
    return <div
        className={`${props.profile.enabled ? "bg-blue-400 text-white" : "bg-gray-200 text-black"}
                        p-4 rounded-md flex flex-col items-center cursor-pointer
                        transition-all duration-200`}
        onClick={props.onClick}
    >
        <img alt={props.profile.username} src={props.profile.profile_pic} className={"rounded-full mb-1"}/>
        <p>{props.profile.username}</p>
        <p>{props.profile.full_name}</p>
    </div>;
}