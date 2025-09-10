import React from 'react';
import { getInitials, stringToColor } from '../../utils/helpers';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const initials = getInitials(name || alt);
  const backgroundColor = stringToColor(name || alt);

  const baseClasses = `
    inline-flex items-center justify-center rounded-full font-medium text-white
    ${sizes[size]} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${baseClasses} object-cover`}
        onClick={onClick}
        {...props}
      />
    );
  }

  return (
    <div
      className={baseClasses}
      style={{ backgroundColor }}
      onClick={onClick}
      {...props}
    >
      {initials}
    </div>
  );
};

export default Avatar;