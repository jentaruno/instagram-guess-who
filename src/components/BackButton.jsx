export function BackButton(props) {
  return (
    <button
      className={"p-0 border-none focus:outline-none bg-transparent"}
      onClick={props.onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-arrow-left"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M 18 8 a 1 1 0 0 0 -1 -1 H 5.7 l 3.147 -3.146 a 1 1 0 0 0 -1.4 -1.4 l -4.8 4.8 a 1 1 0 0 0 0 1.4 l 4.8 4.8 a 1 1 0 0 0 1.4 -1.4 L 5.7 9 H 17 A 1 1 0 0 0 18 8"
        />
      </svg>
    </button>
  );
}
