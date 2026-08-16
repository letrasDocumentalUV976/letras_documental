import { UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  ref: React.Ref<HTMLInputElement>;
  placeholder: string;
  value?: string;
  type?: string;
  isLabel?: boolean;
  label?: string;
  icon?: React.ReactNode;
  register?: UseFormRegisterReturn;
  errors?: boolean;
  message?: string;
}

const TextField = ({
  name,
  onChange,
  onBlur,
  ref,
  placeholder,
  value,
  type,
  isLabel,
  label,
  register,
  errors,
  message,
}: TextFieldProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {isLabel && (
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      <input
        onBlur={onBlur}
        ref={ref}
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        value={value || ""}
        type={type || "text"}
        className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-primary"
        {...register}
      />
      {errors && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default TextField;
