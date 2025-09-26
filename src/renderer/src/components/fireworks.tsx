import { useEffect, useRef } from 'react';
import { Fireworks as FireworksJS } from 'fireworks-js';

interface FireworksProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function Fireworks({ show, onComplete, duration = 3000 }: FireworksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<FireworksJS | null>(null);

  useEffect(() => {
    if (show && containerRef.current) {
      // 创建烟花实例 - 使用优化配置
      fireworksRef.current = new FireworksJS(containerRef.current, {
        autoresize: true,
        opacity: 0.8,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 80,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 8,
        intensity: 40,
        flickering: 50,
        lineStyle: 'round',
        hue: {
          min: 0,
          max: 360
        },
        delay: {
          min: 15,
          max: 30
        },
        rocketsPoint: {
          min: 50,
          max: 50
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 4
          },
          trace: {
            min: 1,
            max: 3
          }
        },
        brightness: {
          min: 50,
          max: 80
        },
        decay: {
          min: 0.015,
          max: 0.03
        },
        mouse: {
          click: false,
          move: false,
          max: 1
        }
      });

      // 启动烟花
      fireworksRef.current.start();

      // 设置自动停止
      const timer = setTimeout(() => {
        if (fireworksRef.current) {
          fireworksRef.current.stop();
        }
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => {
        clearTimeout(timer);
        if (fireworksRef.current) {
          fireworksRef.current.stop();
          fireworksRef.current = null;
        }
      };
    }
    return undefined;
  }, [show, onComplete, duration]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        width: '100vw',
        height: '100vh',
        background: 'transparent'
      }}
    />
  );
}
