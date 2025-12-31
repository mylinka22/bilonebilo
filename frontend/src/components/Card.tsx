import { motion } from 'framer-motion';
import './Card.css';

interface CardProps {
  text: string;
  isFlipped: boolean;
}

export default function Card({ text, isFlipped }: CardProps) {
  return (
    <div className="card-container">
      <motion.div
        className="card"
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="card-face card-back">
          <div className="card-back-pattern">?</div>
        </div>
        <div
          className="card-face card-front"
          style={{
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="card-text">{text}</div>
        </div>
      </motion.div>
    </div>
  );
}

