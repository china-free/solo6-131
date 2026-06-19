import {
  UV_SYMBOLS,
  PERSPECTIVE_POINTS,
  STARS,
  SOLVENT_REVEALS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '@/data/paintingData';

const W = CANVAS_WIDTH;
const H = CANVAS_HEIGHT;

function seededNoise(x: number, y: number, seed = 1): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function fillNoise(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number,
  scale = 1,
  seed = 1,
) {
  const img = ctx.createImageData(w / scale, h / scale);
  for (let i = 0; i < img.data.length; i += 4) {
    const px = (i / 4) % (w / scale);
    const py = Math.floor(i / 4 / (w / scale));
    const v = Math.floor(seededNoise(px, py, seed) * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = Math.floor(alpha * 255);
  }
  const tmp = document.createElement('canvas');
  tmp.width = w / scale;
  tmp.height = h / scale;
  tmp.getContext('2d')!.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(tmp, 0, 0, w, h);
}

export function drawVarnishLayer(ctx: CanvasRenderingContext2D) {
  const t = ctx.canvas.transferControlToOffscreen;
  void t;

  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.45, 50, W * 0.5, H * 0.5, 700);
  bgGrad.addColorStop(0, '#4A3728');
  bgGrad.addColorStop(0.5, '#2B1E13');
  bgGrad.addColorStop(1, '#140C07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 12; i++) {
    const x = 80 + (i * (W - 160)) / 11;
    const grad = ctx.createLinearGradient(x, 0, x + 30, H);
    grad.addColorStop(0, 'rgba(100,70,40,0.18)');
    grad.addColorStop(0.5, 'rgba(60,40,20,0.06)');
    grad.addColorStop(1, 'rgba(80,50,25,0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 30, H);
  }

  const archGrad = ctx.createLinearGradient(0, 80, 0, 500);
  archGrad.addColorStop(0, 'rgba(120,90,50,0.5)');
  archGrad.addColorStop(1, 'rgba(50,30,15,0.8)');
  ctx.fillStyle = archGrad;
  ctx.beginPath();
  ctx.moveTo(80, 600);
  ctx.bezierCurveTo(80, 350, 200, 80, W / 2, 80);
  ctx.bezierCurveTo(600, 80, W - 80, 350, W - 80, 600);
  ctx.lineTo(W - 80, H - 100);
  ctx.lineTo(80, H - 100);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 15; i++) {
    const x = 120 + (i * (W - 240)) / 14;
    ctx.strokeStyle = `rgba(${60 + i * 3}, ${35 + i * 2}, ${15 + i}, 0.25)`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.quadraticCurveTo(W / 2 + (i - 7) * 12, 90, x, 110);
    ctx.stroke();
  }

  const throneGrad = ctx.createLinearGradient(W / 2, 400, W / 2, 800);
  throneGrad.addColorStop(0, '#8B2C2C');
  throneGrad.addColorStop(0.5, '#6B1E1E');
  throneGrad.addColorStop(1, '#3F1010');
  ctx.fillStyle = throneGrad;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 180, 720);
  ctx.lineTo(W / 2 - 160, 480);
  ctx.lineTo(W / 2 - 100, 380);
  ctx.lineTo(W / 2 + 100, 380);
  ctx.lineTo(W / 2 + 160, 480);
  ctx.lineTo(W / 2 + 180, 720);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.stroke();

  for (let r = 0; r < 5; r++) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(212,175,55,${0.5 - r * 0.08})`;
    ctx.lineWidth = 1.5;
    ctx.arc(W / 2, 280, 160 - r * 10, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }

  const haloGrad = ctx.createRadialGradient(W / 2, 280, 20, W / 2, 280, 180);
  haloGrad.addColorStop(0, 'rgba(255,230,150,0.9)');
  haloGrad.addColorStop(0.4, 'rgba(255,200,100,0.3)');
  haloGrad.addColorStop(1, 'rgba(255,180,80,0)');
  ctx.fillStyle = haloGrad;
  ctx.fillRect(W / 2 - 200, 100, 400, 400);

  ctx.fillStyle = '#5A3A22';
  ctx.beginPath();
  ctx.ellipse(W / 2, 310, 60, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E8C8A8';
  ctx.beginPath();
  ctx.ellipse(W / 2, 300, 48, 58, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3E2723';
  ctx.beginPath();
  ctx.ellipse(W / 2, 255, 50, 40, 0, 0, Math.PI, true);
  ctx.fill();

  ctx.fillStyle = 'rgba(60,40,30,0.8)';
  ctx.beginPath();
  ctx.ellipse(W / 2 - 14, 295, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(W / 2 + 14, 295, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 8, 320);
  ctx.quadraticCurveTo(W / 2, 326, W / 2 + 8, 320);
  ctx.stroke();

  const robeGrad = ctx.createRadialGradient(W / 2, 520, 40, W / 2, 520, 260);
  robeGrad.addColorStop(0, '#4169E1');
  robeGrad.addColorStop(0.5, '#2E4FA3');
  robeGrad.addColorStop(1, '#1A2F66');
  ctx.fillStyle = robeGrad;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 220, 780);
  ctx.quadraticCurveTo(W / 2 - 200, 470, W / 2 - 100, 400);
  ctx.lineTo(W / 2 + 100, 400);
  ctx.quadraticCurveTo(W / 2 + 200, 470, W / 2 + 220, 780);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,230,150,0.35)';
  ctx.lineWidth = 1;
  for (let f = 0; f < 8; f++) {
    ctx.beginPath();
    const y = 440 + f * 45;
    ctx.moveTo(W / 2 - 200 + f * 8, y);
    ctx.quadraticCurveTo(W / 2, y + 15, W / 2 + 200 - f * 8, y);
    ctx.stroke();
  }

  const innerRobe = ctx.createRadialGradient(W / 2, 500, 30, W / 2, 500, 200);
  innerRobe.addColorStop(0, '#C71585');
  innerRobe.addColorStop(0.6, '#8B0A4F');
  innerRobe.addColorStop(1, '#5B0030');
  ctx.fillStyle = innerRobe;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 140, 750);
  ctx.quadraticCurveTo(W / 2 - 120, 480, W / 2 - 60, 430);
  ctx.lineTo(W / 2 + 60, 430);
  ctx.quadraticCurveTo(W / 2 + 120, 480, W / 2 + 140, 750);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F5DEB3';
  ctx.beginPath();
  ctx.ellipse(W / 2, 500, 45, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  const halo2 = ctx.createRadialGradient(W / 2, 490, 10, W / 2, 490, 80);
  halo2.addColorStop(0, 'rgba(255,230,150,0.7)');
  halo2.addColorStop(1, 'rgba(255,200,80,0)');
  ctx.fillStyle = halo2;
  ctx.fillRect(W / 2 - 90, 410, 180, 170);

  ctx.fillStyle = 'rgba(90,60,40,0.7)';
  ctx.beginPath();
  ctx.arc(W / 2 - 12, 495, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(W / 2 + 12, 495, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 90, 540);
  ctx.quadraticCurveTo(W / 2 - 70, 560, W / 2 - 50, 540);
  ctx.quadraticCurveTo(W / 2 - 30, 560, W / 2 - 10, 540);
  ctx.quadraticCurveTo(W / 2 + 10, 560, W / 2 + 30, 540);
  ctx.quadraticCurveTo(W / 2 + 50, 560, W / 2 + 70, 540);
  ctx.quadraticCurveTo(W / 2 + 90, 560, W / 2 + 90, 545);
  ctx.lineTo(W / 2 + 90, 560);
  ctx.lineTo(W / 2 - 90, 560);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 180, 780);
  ctx.quadraticCurveTo(W / 2 - 170, 730, W / 2 - 130, 700);
  ctx.lineTo(W / 2, 710);
  ctx.lineTo(W / 2 + 130, 700);
  ctx.quadraticCurveTo(W / 2 + 170, 730, W / 2 + 180, 780);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const floorGrad = ctx.createLinearGradient(0, 820, 0, H);
  floorGrad.addColorStop(0, '#3E2A18');
  floorGrad.addColorStop(1, '#1A0F08');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 780, W, H - 780);

  for (let t = 0; t < 10; t++) {
    ctx.strokeStyle = `rgba(212,175,55,${0.15 - t * 0.01})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 790 + t * 18);
    ctx.lineTo(W, 790 + t * 18);
    ctx.stroke();
  }

  for (let i = 0; i < 40; i++) {
    const x = 50 + Math.random() * (W - 100);
    const y = 120 + Math.random() * 500;
    ctx.strokeStyle = `rgba(100,70,40,${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.5 + Math.random() * 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
    ctx.stroke();
  }

  fillNoise(ctx, W, H, 0.12, 2, 7);

  const crack = ctx.createLinearGradient(0, 0, 0, H);
  crack.addColorStop(0, 'rgba(0,0,0,0)');
  crack.addColorStop(0.5, 'rgba(0,0,0,0.2)');
  crack.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = crack;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 50);
  ctx.quadraticCurveTo(230, 250, 210, 500);
  ctx.quadraticCurveTo(190, 700, 220, 950);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(620, 80);
  ctx.quadraticCurveTo(600, 300, 630, 550);
  ctx.quadraticCurveTo(650, 800, 600, 970);
  ctx.stroke();

  const old = ctx.createRadialGradient(W * 0.5, H * 0.5, 100, W * 0.5, H * 0.5, 700);
  old.addColorStop(0, 'rgba(180,140,80,0)');
  old.addColorStop(1, 'rgba(80,50,20,0.45)');
  ctx.fillStyle = old;
  ctx.fillRect(0, 0, W, H);

  for (let s = 0; s < 30; s++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 0.3 + Math.random() * 1.8;
    ctx.fillStyle = `rgba(40,25,10,${0.4 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawUVLayer(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(20,0,40,0.55)';
  ctx.fillRect(0, 0, W, H);

  UV_SYMBOLS.forEach((sym) => {
    ctx.save();
    ctx.translate(sym.x, sym.y);

    ctx.shadowColor = '#E040FB';
    ctx.shadowBlur = 25;
    ctx.strokeStyle = '#E040FB';
    ctx.lineWidth = 3.5;
    ctx.fillStyle = 'rgba(224,64,251,0.3)';

    if (sym.type === 'inverted-cross') {
      ctx.beginPath();
      ctx.moveTo(0, -sym.size);
      ctx.lineTo(0, sym.size);
      ctx.moveTo(0, sym.size * 0.35);
      ctx.lineTo(-sym.size * 0.75, sym.size * 0.35);
      ctx.lineTo(sym.size * 0.75, sym.size * 0.35);
      ctx.stroke();
      ctx.font = `bold ${sym.size * 0.3}px Cinzel Decorative, serif`;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#E040FB';
      ctx.fillText('INRI', 0, -sym.size - 10);
    } else if (sym.type === 'pentagram') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI * 2) / 5;
        const px = Math.cos(angle) * sym.size;
        const py = Math.sin(angle) * sym.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, sym.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (sym.type === 'number') {
      ctx.font = `bold ${sym.size}px Cinzel Decorative, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#E040FB';
      ctx.shadowBlur = 20;
      ctx.fillText(sym.value || '?', 0, 0);
    }
    ctx.restore();
  });

  ctx.fillStyle = 'rgba(224,64,251,0.08)';
  for (let k = 0; k < 5; k++) {
    ctx.beginPath();
    ctx.arc(
      100 + k * 150 + Math.sin(k) * 30,
      150 + k * 160,
      25 + Math.random() * 20,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();
}

export function drawIRLayer(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = 'rgba(60,30,15,0.92)';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(10,5,2,0.95)';
  ctx.lineWidth = 0.6;

  for (let i = 1; i < 20; i++) {
    ctx.beginPath();
    const y = (i * H) / 20;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let i = 1; i < 16; i++) {
    ctx.beginPath();
    const x = (i * W) / 16;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.lineWidth = 0.8;
  ctx.setLineDash([6, 4]);
  PERSPECTIVE_POINTS.forEach((vp) => {
    PERSPECTIVE_POINTS.forEach((other) => {
      if (vp.id < other.id) {
        ctx.beginPath();
        ctx.moveTo(vp.x, vp.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    });
  });

  for (let r = 0; r < 8; r++) {
    ctx.beginPath();
    ctx.moveTo(0, 800 - r * 80);
    ctx.lineTo(W, 800 - r * 80);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  PERSPECTIVE_POINTS.forEach((vp) => {
    ctx.save();
    ctx.translate(vp.x, vp.y);

    ctx.strokeStyle = 'rgba(0,0,0,0.95)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 18);
    ctx.stroke();

    for (let r = 0; r < 3; r++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,0,0,${0.7 - r * 0.2})`;
      ctx.arc(0, 0, 25 + r * 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(0,0,0,0.95)';
    ctx.font = 'bold 14px Cinzel Decorative, serif';
    ctx.textAlign = 'center';
    ctx.fillText(vp.label, 0, -35);
    ctx.fillText(`(${vp.x}, ${vp.y})`, 0, 50);

    if (vp.id === 3) {
      ctx.strokeStyle = 'rgba(0,0,0,0.95)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-20, -20, 40, 40);
      ctx.font = 'bold 18px Cinzel Decorative, serif';
      ctx.fillText('★', 0, 75);
    }
    ctx.restore();
  });

  ctx.strokeStyle = 'rgba(30,15,5,0.85)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(W / 2, 310, 55, 65, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(W / 2 - 50, 360);
  ctx.quadraticCurveTo(W / 2 - 80, 500, W / 2 - 130, 700);
  ctx.moveTo(W / 2 + 50, 360);
  ctx.quadraticCurveTo(W / 2 + 80, 500, W / 2 + 130, 700);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(W / 2, 500, 40, 45, 0, 0, Math.PI * 2);
  ctx.stroke();

  for (let s = 0; s < 200; s++) {
    const x = 40 + Math.random() * (W - 80);
    const y = 60 + Math.random() * (H - 120);
    ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.3 + Math.random() * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawStarmapLayer(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,30,0.85)';
  ctx.fillRect(0, 0, W, H);

  for (let s = 0; s < 200; s++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 0.3 + Math.random() * 1.2;
    const a = 0.25 + Math.random() * 0.75;
    ctx.fillStyle = `rgba(255,255,220,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const starById = Object.fromEntries(STARS.map((s) => [s.id, s]));

  ctx.strokeStyle = 'rgba(180,200,255,0.45)';
  ctx.lineWidth = 1.2;
  STARS.forEach((star) => {
    if (star.connectedTo) {
      star.connectedTo.forEach((id) => {
        const target = starById[id];
        if (target && star.id < id) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });
    }
  });

  STARS.forEach((star) => {
    ctx.save();
    ctx.translate(star.x, star.y);

    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, star.size * 6);
    glow.addColorStop(0, `rgba(255,250,210,${star.brightness})`);
    glow.addColorStop(0.3, `rgba(200,220,255,${star.brightness * 0.5})`);
    glow.addColorStop(1, 'rgba(100,150,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, star.size * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255,255,240,${star.brightness})`;
    ctx.beginPath();
    ctx.arc(0, 0, star.size, 0, Math.PI * 2);
    ctx.fill();

    if (star.isKey) {
      ctx.strokeStyle = 'rgba(255,215,100,0.95)';
      ctx.lineWidth = 2;
      for (let r = 0; r < 2; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, star.size * (3 + r * 2), 0, Math.PI * 2);
        ctx.stroke();
      }

      const rays = 4;
      ctx.strokeStyle = 'rgba(255,230,150,0.85)';
      ctx.lineWidth = 1.5;
      for (let k = 0; k < rays; k++) {
        const ang = (k * Math.PI) / rays;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * star.size * 2, Math.sin(ang) * star.size * 2);
        ctx.lineTo(Math.cos(ang) * star.size * 9, Math.sin(ang) * star.size * 9);
        ctx.stroke();
      }
    }

    if (star.isKey) {
      ctx.fillStyle = 'rgba(255,230,150,0.95)';
      ctx.font = 'bold 11px Cinzel Decorative, serif';
      ctx.textAlign = 'center';
      ctx.fillText(star.name, 0, -star.size * 11);
    }
    ctx.restore();
  });

  ctx.strokeStyle = 'rgba(180,200,255,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  const milky = ctx.createLinearGradient(0, 0, W, H);
  milky.addColorStop(0, 'rgba(200,200,255,0)');
  milky.addColorStop(0.5, 'rgba(200,200,255,0.08)');
  milky.addColorStop(1, 'rgba(200,200,255,0)');
  ctx.fillStyle = milky;
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.bezierCurveTo(300, 180, 500, 400, W, 250);
  ctx.lineTo(W, 350);
  ctx.bezierCurveTo(500, 500, 300, 280, 0, 400);
  ctx.closePath();
  ctx.fill();
  ctx.setLineDash([]);

  ctx.restore();
}

export function drawSolventLayer(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  SOLVENT_REVEALS.forEach((el) => {
    ctx.save();
    ctx.translate(el.x, el.y);

    ctx.shadowColor = '#69F0AE';
    ctx.shadowBlur = 20;

    if (el.type === 'signature') {
      ctx.fillStyle = '#1A3A1A';
      ctx.font = `italic bold ${el.size}px Homemade Apple, cursive`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.value, 0, 0);
    } else if (el.type === 'roman') {
      ctx.fillStyle = '#2E5D2E';
      ctx.font = `bold ${el.size}px Cinzel Decorative, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.value, 0, 0);

      ctx.font = '12px Cormorant Garamond, serif';
      ctx.fillStyle = '#3E2723';
      ctx.shadowBlur = 8;
      ctx.fillText('= 1525 (M D X X V)', 0, 30);
    } else if (el.type === 'element-symbol') {
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(27,94,32,0.2)';
      const s = el.size;

      if (el.value === 'fire') {
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.9);
        ctx.lineTo(s * 0.9, s * 0.6);
        ctx.lineTo(-s * 0.9, s * 0.6);
        ctx.closePath();
        ctx.stroke();
        ctx.font = `${s * 0.35}px Cinzel Decorative, serif`;
        ctx.textAlign = 'center';
        ctx.fillText('火', 0, s * 0.2);
      } else if (el.value === 'water') {
        ctx.beginPath();
        ctx.moveTo(0, s * 0.9);
        ctx.lineTo(s * 0.9, -s * 0.6);
        ctx.lineTo(-s * 0.9, -s * 0.6);
        ctx.closePath();
        ctx.stroke();
        ctx.font = `${s * 0.35}px Cinzel Decorative, serif`;
        ctx.textAlign = 'center';
        ctx.fillText('水', 0, 0);
      } else if (el.value === 'earth') {
        ctx.beginPath();
        ctx.moveTo(0, s * 0.9);
        ctx.lineTo(s * 0.9, -s * 0.6);
        ctx.lineTo(-s * 0.9, -s * 0.6);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.7, -s * 0.1);
        ctx.lineTo(s * 0.7, -s * 0.1);
        ctx.stroke();
        ctx.font = `${s * 0.35}px Cinzel Decorative, serif`;
        ctx.textAlign = 'center';
        ctx.fillText('土', 0, s * 0.3);
      } else if (el.value === 'air') {
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.9);
        ctx.lineTo(s * 0.9, s * 0.6);
        ctx.lineTo(-s * 0.9, s * 0.6);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.7, s * 0.1);
        ctx.lineTo(s * 0.7, s * 0.1);
        ctx.stroke();
        ctx.font = `${s * 0.35}px Cinzel Decorative, serif`;
        ctx.textAlign = 'center';
        ctx.fillText('气', 0, -s * 0.2);
      }
    }
    ctx.restore();
  });

  ctx.restore();
}

export function drawScanGlow(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number } | null,
  tool: 'uv' | 'ir' | 'solvent' | null,
) {
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  if (!pos || !tool) {
    ctx.restore();
    return;
  }

  const colors: Record<string, { inner: string; mid: string; outer: string }> = {
    uv: { inner: 'rgba(255,180,255,1)', mid: 'rgba(224,64,251,0.5)', outer: 'rgba(156,39,176,0)' },
    ir: { inner: 'rgba(255,180,180,1)', mid: 'rgba(255,82,82,0.5)', outer: 'rgba(229,57,53,0)' },
    solvent: { inner: 'rgba(180,255,220,1)', mid: 'rgba(105,240,174,0.5)', outer: 'rgba(76,175,80,0)' },
  };

  const c = colors[tool];
  const radius = tool === 'solvent' ? 70 : 95;

  const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
  glow.addColorStop(0, c.inner);
  glow.addColorStop(0.15, c.mid);
  glow.addColorStop(0.5, c.outer);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = c.mid;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const core = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
  core.addColorStop(0, 'rgba(255,255,255,1)');
  core.addColorStop(1, c.inner);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawOverlayLayer(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.clearRect(0, 0, W, H);

  PERSPECTIVE_POINTS.forEach((vp) => {
    const cross = ctx.createRadialGradient(vp.x, vp.y, 0, vp.x, vp.y, 40);
    cross.addColorStop(0, 'rgba(255,255,0,0.6)');
    cross.addColorStop(1, 'rgba(255,255,0,0)');
    ctx.fillStyle = cross;
    ctx.beginPath();
    ctx.arc(vp.x, vp.y, 40, 0, Math.PI * 2);
    ctx.fill();
  });

  STARS.filter((s) => s.isKey).forEach((star) => {
    ctx.strokeStyle = 'rgba(255,255,100,0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(star.x, star.y, 25, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(star.x, star.y, 35, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
}
