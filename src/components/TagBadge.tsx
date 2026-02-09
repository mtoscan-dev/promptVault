import { getTagStyle } from '@/utils/styling';

interface TagBadgeProps {
  name: string;
  className?: string; // Adding className for flexibility if needed, though not strictly in user snippet
  onClick?: () => void;
}

export const TagBadge = ({ name, className = '', onClick }: TagBadgeProps) => {
  const style = getTagStyle(name);
  
  return (
    <span 
      onClick={onClick}
      style={style}
      className={`terminal-flicker px-2 py-0.5 border text-xs font-mono rounded-md uppercase tracking-tighter transition-all hover:brightness-125 cursor-default ${className}`}
    >
      $ {name}
    </span>
  );
};
