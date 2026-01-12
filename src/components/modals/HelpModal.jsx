import { TbMessageQuestion, TbReload, TbUserQuestion } from "react-icons/tb";
import { BaseModal } from "./BaseModal.jsx";
import { BsThreeDots } from "react-icons/bs";

export function HelpModal({ hideModal }) {
  return (
    <BaseModal title="Help" hideModal={hideModal} size="large">
      <div className="flex-grow overflow-auto mb-6 pr-2">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">How to Play</h3>
          <p className="mb-3 text-lg">
            Instagram Guess Who is a twist on the classic two-player game{" "}
            <a href="https://en.wikipedia.org/wiki/Guess_Who%3F">Guess Who</a>,
            where each player tries to guess the identity of the other person's
            chosen character. Here, all the characters on the board are your
            mutual followers!
          </p>
          <ol className="text-lg list-decimal ml-6 space-y-3">
            <li>
              If you want to choose a different set of mutual followers, click
              Select Users and choose the followers you want on the board.
              <img
                alt={"Tutorial for selecting followers"}
                src={"./tutorial-select.gif"}
                className={"w-full my-2 pr-6"}
              />
            </li>
            <li>
              <p>
                Each player secretly chooses a person on the board. If you want
                to do this randomly, click{" "}
                <BsThreeDots size={24} className="inline -translate-y-[1px]" />{" "}
                More, then
                <TbUserQuestion
                  size={24}
                  className="inline -translate-y-[1px]"
                />{" "}
                Random Follower.
              </p>
            </li>
            <li>
              Take turns asking yes/no questions to deduce who the other person
              chose. If you need question ideas, click{" "}
              <TbMessageQuestion
                size={24}
                className="inline -translate-y-[1px]"
              />{" "}
              for random questions. When answering questions, you can say
              yes/no/unsure. To help deduce, you can click on a follower's card
              to disable it and take it off the possible choices.
              <img
                alt={"Tutorial for eliminating follower cards"}
                src={"./tutorial-eliminate.gif"}
                className={"w-full my-2 pr-6"}
              />
            </li>
            <li>
              If you think you know who the other player chose, make a guess!
              Note that this counts as a turn. The first player to guess
              correctly wins.
            </li>
            <li>
              To play a new game, click{" "}
              <BsThreeDots size={24} className="inline -translate-y-[1px]" />{" "}
              More, then{" "}
              <TbReload size={24} className="inline -translate-y-[1px]" /> Reset
              All to reset the board.
            </li>
          </ol>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="mb-3 text-lg">
            Instagram Guess Who was made by{" "}
            <a
              href="https://jentar.uno"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jen
            </a>{" "}
            and{" "}
            <a
              href="https://kaisoapbox.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kai
            </a>
            . If you have any comments, questions, or feedback, feel free to{" "}
            <a href="mailto:kaisoapbox@gmail.com ?cc=jennifertaruno@gmail.com">
              write to us here!
            </a>
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
