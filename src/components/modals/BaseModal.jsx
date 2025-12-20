import { useEffect, useRef } from "react";

export function BaseModal({ title, hideModal, children, size = "default" }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickAway = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        hideModal();
      }
    };

    document.addEventListener("pointerdown", handleClickAway);
    return () => document.removeEventListener("pointerdown", handleClickAway);
  }, [hideModal]);

  const sizeClasses = {
    default: "w-5/6 max-w-2xl",
    large: "w-5/6 h-5/6 max-w-2xl",
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div
          ref={modalRef}
          className={`relative ${sizeClasses[size]} rounded-xl shadow-xl bg-white dark:bg-gray-800 flex flex-col px-4 py-6 sm:p-6 sm:pb-4`}
        >
          <div className="flex flex-row w-full justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              className={"p-0 border-none focus:outline-none bg-transparent"}
              onClick={hideModal}
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
