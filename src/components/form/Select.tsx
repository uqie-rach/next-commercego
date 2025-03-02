import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  error?: boolean;
  hint?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder = "Select an option", className = "", error, hint, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:outline-none
            ${error ? "border-error-300 focus:ring-error-500/10" : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10"}
            dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${className}`}
          {...props}
        >
          {/* Placeholder option */}
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {/* Map over options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hint && (
          <p className={`mt-2 text-sm ${error ? "text-error-500" : "text-gray-500 dark:text-gray-400"}`}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
