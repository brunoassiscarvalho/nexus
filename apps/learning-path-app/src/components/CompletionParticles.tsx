import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
}

interface CompletionParticlesProps {
  position: { x: number; y: number };
  color: string;
  onComplete?: () => void;
}

export function CompletionParticles({ position, color, onComplete }: CompletionParticlesProps) {
  const [particles] = useState<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: position.x + (Math.random() - 0.5) * 200,
      y: position.y + (Math.random() - 0.5) * 200,
      color: color,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 0.5 + 0.5
    }));
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: position.x,
            top: position.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            x: particle.x - position.x,
            y: particle.y - position.y,
            opacity: 0,
            scale: 1,
          }}
          transition={{
            duration: particle.duration,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Central burst */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: position.x - 30,
          top: position.y - 30,
          width: 60,
          height: 60,
          border: `3px solid ${color}`,
          boxShadow: `0 0 30px ${color}`,
        }}
        initial={{ opacity: 1, scale: 0 }}
        animate={{
          opacity: 0,
          scale: 3,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      />
    </div>
  );
}
