import { TbArrowLeft } from "react-icons/tb";

export function BackButton(props) {
  return (
    <button
      title="Go back"
      className={
        "p-0 border-none focus:outline-none bg-transparent hover:scale-110 transition-all duration-200"
      }
      onClick={props.onClick}
    >
      <TbArrowLeft size={24} />
    </button>
  );
}
