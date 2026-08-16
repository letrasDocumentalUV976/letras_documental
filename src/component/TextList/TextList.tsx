import React, { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type AutocompleteProps = {
  label?: string;
  options: string[];
  placeholder: string;
  errors?: boolean;
  message?: string;
  register?: UseFormRegisterReturn;
  defaultValue?: string;
};

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  options,
  placeholder,
  errors,
  message,
  register,
  defaultValue,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  const notifyChange = (value: string) => {
    register?.onChange({
      target: { name: register.name, value },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    notifyChange(value);

    if (value) {
      const filtered = options.filter((option) =>
        option?.toLowerCase().includes(value?.toLowerCase())
      );
      setFilteredOptions(filtered);
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setDropdownVisible(false);
    notifyChange(option);
  };

  return (
    <div className="relative flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <input
        name={register?.name}
        ref={register?.ref}
        onBlur={register?.onBlur}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setDropdownVisible(!!filteredOptions.length)}
        className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
        placeholder={placeholder}
      />
      {isDropdownVisible && (
        <ul className="absolute top-full z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">
              Sin resultados
            </li>
          )}
        </ul>
      )}
      {errors && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default Autocomplete;
