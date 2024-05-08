import "./progressbar.css";
import { motion, animate } from 'framer-motion';
import { useEffect, useRef } from "react";

interface ProgressbarProps {
  value: number;
}

const Progressbar: React.FC<ProgressbarProps> = ({ value }) => {
  const progressTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const progressText = progressTextRef.current?.textContent;
    if (progressText != null) {
      animate(parseInt(progressText), value, {
        duration: 2,
        onUpdate: (cv) => {
          if (progressTextRef.current) {
            progressTextRef.current.textContent = cv.toFixed(0);
          }
        }
      });
    }
  }, [value]);

  return (
    <div className="progressbar-container">
      <div className="progressbar">
        <motion.div
          className="bar"
          animate={{
            width: `${value}%`
          }}
          transition={{
            duration: 2
          }}
        />
      </div>
      <div className="progressbar-text-container">
        <p ref={progressTextRef}>0</p>
        <p>%</p>
      </div>
    </div>
  );
};

export default Progressbar;
