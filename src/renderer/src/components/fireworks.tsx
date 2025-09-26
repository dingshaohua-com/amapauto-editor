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

      // 开始渐减过程 - 在70%的时间后开始逐渐减少烟花
      const fadeStartTime = duration * 0.7;
      const fadeTimer = setTimeout(() => {
        // 逐渐减少烟花强度和频率
        let currentIntensity = 40;
        let currentParticles = 80;
        let currentDelay = 30;
        let currentOpacity = 0.8;

        const reduceInterval = setInterval(() => {
          if (fireworksRef.current && currentIntensity > 0) {
            // 逐渐减少强度、粒子数量，增加延迟，降低透明度
            currentIntensity = Math.max(0, currentIntensity - 3);
            currentParticles = Math.max(10, currentParticles - 6);
            currentDelay = Math.min(200, currentDelay + 25);
            currentOpacity = Math.max(0.1, currentOpacity - 0.08);

            // 使用 updateOptions 动态更新配置
            fireworksRef.current.updateOptions({
              opacity: currentOpacity,
              particles: currentParticles,
              intensity: currentIntensity,
              explosion: Math.max(2, Math.floor(8 * (currentIntensity / 40))),
              delay: {
                min: currentDelay,
                max: currentDelay + 40
              },
              brightness: {
                min: Math.max(20, 50 * (currentIntensity / 40)),
                max: Math.max(40, 80 * (currentIntensity / 40))
              }
            });

            // 当强度降到很低时，使用 waitStop 平滑停止
            if (currentIntensity <= 6) {
              clearInterval(reduceInterval);

              // 使用异步停止，更平滑
              fireworksRef.current.waitStop(false).then(() => {
                if (onComplete) {
                  onComplete();
                }
              });
            }
          }
        }, 500); // 每500ms减少一次强度，让变化更平滑
      }, fadeStartTime);

      return () => {
        clearTimeout(fadeTimer);
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
