import React, { useEffect, useRef } from 'react';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Grid points
    const rows = 18;
    const cols = 28;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep dark luxury background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        50,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0a0d18');
      bgGrad.addColorStop(0.5, '#040711');
      bgGrad.addColorStop(1, '#020307');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient glowing orbs
      const glowOrb1 = ctx.createRadialGradient(
        width * 0.2 + Math.sin(time * 0.5) * 60,
        height * 0.3 + Math.cos(time * 0.5) * 40,
        0,
        width * 0.2,
        height * 0.3,
        350
      );
      glowOrb1.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
      glowOrb1.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = glowOrb1;
      ctx.fillRect(0, 0, width, height);

      const glowOrb2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(time * 0.6) * 50,
        height * 0.6 + Math.sin(time * 0.6) * 50,
        0,
        width * 0.8,
        height * 0.6,
        400
      );
      glowOrb2.addColorStop(0, 'rgba(6, 182, 212, 0.10)');
      glowOrb2.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = glowOrb2;
      ctx.fillRect(0, 0, width, height);

      // Perspective projection grid (3D wave plane)
      const fov = 400;
      const cameraY = 180;
      const cameraZ = -120;

      const project = (x: number, y: number, z: number) => {
        const pz = z - cameraZ;
        if (pz <= 0) return null;
        const scale = fov / pz;
        const px = width / 2 + x * scale;
        const py = height * 0.65 + (y - cameraY) * scale;
        return { px, py, scale };
      };

      const points: ({ px: number; py: number; scale: number; alpha: number } | null)[][] = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
          const worldX = (c - cols / 2) * 55;
          const worldZ = r * 50 + 60;
          const wave = Math.sin(r * 0.4 + time + c * 0.25) * 22;
          const proj = project(worldX, wave, worldZ);
          if (proj) {
            const depthRatio = Math.max(0, 1 - r / rows);
            points[r][c] = {
              ...proj,
              alpha: depthRatio * 0.45,
            };
          } else {
            points[r][c] = null;
          }
        }
      }

      // Draw grid lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          if (!p) continue;

          // Connect horizontally
          if (c < cols - 1 && points[r][c + 1]) {
            const pRight = points[r][c + 1]!;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(pRight.px, pRight.py);
            ctx.strokeStyle = `rgba(56, 189, 248, ${p.alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Connect depth-wise
          if (r < rows - 1 && points[r + 1][c]) {
            const pDown = points[r + 1][c]!;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(pDown.px, pDown.py);
            ctx.strokeStyle = `rgba(168, 85, 247, ${p.alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Node points
          if (r % 2 === 0 && c % 2 === 0) {
            ctx.beginPath();
            ctx.arc(p.px, p.py, Math.max(1, p.scale * 1.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha * 0.6})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
