import { useScrollReveal } from '../hooks/useScrollReveal';

function Reveal({ children, className = '' }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export default Reveal;
