import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} className="w-10 h-10 rounded-full" />;
};

export default Avatar;
