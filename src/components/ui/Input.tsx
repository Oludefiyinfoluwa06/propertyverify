"use client";

type InputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  min?: string | number;
  max?: string | number;
};

export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  disabled,
  className = '',
  min,
  max,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-white border border-gray-300
          text-gray-900 text-base
          placeholder:text-gray-400
          transition duration-200 ease-in-out
          disabled:bg-gray-50 disabled:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-green-500/20 focus:border-green-500
          ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}