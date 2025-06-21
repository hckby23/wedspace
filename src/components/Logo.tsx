
interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <span className={`font-playfair font-bold ${sizeClasses[size]} ${className} group cursor-default`}>
      <span className="text-rose-600 group-hover:text-amber-500 transition-colors duration-300">
        wed
      </span>
      <span className="text-amber-500 group-hover:text-rose-600 transition-colors duration-300">
        space
      </span>
    </span>
  );
};

export default Logo;
