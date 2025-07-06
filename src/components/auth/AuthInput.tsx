import React from 'react';

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  icon: React.ReactNode;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  showPassword?: boolean;
}

export default function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  error,
  icon,
  showPasswordToggle = false,
  onPasswordToggle,
  showPassword = false
}: AuthInputProps) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-semibold text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-blue-400">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          className={`block w-full pl-12 pr-${showPasswordToggle ? '12' : '4'} py-4 bg-white/10 border-2 ${error ? 'border-red-400 focus:border-red-500' : 'border-white/20 focus:border-blue-400'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:bg-white/20 focus:bg-white/10 shadow-sm hover:shadow-md focus:shadow-lg backdrop-blur-sm`}
          placeholder={placeholder}
        />
        {showPasswordToggle && onPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 hover:scale-110 transform"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-xs text-red-400 animate-pulse">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
} 