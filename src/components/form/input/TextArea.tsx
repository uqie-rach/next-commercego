import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder = "Enter your message",
      rows = 3,
      className = "",
      disabled = false,
      error = false,
      hint = "",
      ...props
    },
    ref
  ) => {
    let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none ${className}`;

    if (disabled) {
      textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
      textareaClasses += ` bg-transparent text-gray-400 border-gray-300 focus:border-error-300 focus:ring focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
    } else {
      textareaClasses += ` bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
      <div className="relative">
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={textareaClasses}
          {...props} // Menangani value, onChange, dll. dari props
        />
        {hint && (
          <p
            className={`mt-2 text-sm ${error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea"; // Menyelesaikan warning React tentang displayName

export default TextArea;
