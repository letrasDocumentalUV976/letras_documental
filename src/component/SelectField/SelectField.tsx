import { UseFormRegisterReturn } from "react-hook-form";
import { MdKeyboardArrowDown } from "react-icons/md";

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
      <div className="relative">
        <select
          className="w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-2 pr-9 text-gray-800 outline-none transition-colors hover:border-gray-400 focus:border-primary"
          {...register}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <MdKeyboardArrowDown
          size={20}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
};

export default SelectField;
