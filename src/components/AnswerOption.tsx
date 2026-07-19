import type { AnswerOption as AnswerOptionType } from "../types/diagnostic";

interface AnswerOptionProps {
  option: AnswerOptionType;
  questionId: string;
  checked: boolean;
  onSelect: (optionId: string) => void;
}

export function AnswerOption({ option, questionId, checked, onSelect }: AnswerOptionProps) {
  return (
    <label
      className={`answer-option${checked ? " answer-option--selected" : ""}`}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          onSelect(option.id);
        }
      }}
    >
      <input
        className="answer-option__input"
        type="radio"
        name={questionId}
        value={option.id}
        checked={checked}
        onChange={() => onSelect(option.id)}
      />
      <span className="answer-option__indicator" aria-hidden="true">
        <span />
      </span>
      <span className="answer-option__text">{option.text}</span>
    </label>
  );
}
