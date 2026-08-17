import { UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  isLabel?: boolean;
  label?: string;
  placeholder: string;
  options: SelectOption[];
  register?: UseFormRegisterReturn;
}

const SelectField = ({
  isLabel,
  label,
  placeholder,
  options,
  register,
}: SelectFieldProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {isLabel && (
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <select
        className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors focus:border-primary"
        {...register}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
