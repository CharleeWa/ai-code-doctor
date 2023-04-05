import { FC } from 'react';

interface Props {
  target: string;
  onChange: (target: string) => void;
}

export const TargetSelect: FC<Props> = ({ target, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      className="w-full rounded-md bg-[#1F2937] px-4 py-2 text-neutral-200"
      value={target}
      onChange={handleChange}
    >
    {targets
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((target) => (
        <option key={target.value} value={target.value}>
          {target.label}
        </option>
      ))}
    </select>
  );
};

const targets = [
  { value: 'BugFixer', label: 'Bug fixer' },
  { value: 'ExplainCode', label: 'Explain code' },
  { value: 'RefactorCode', label: 'Refactor the code' },
];