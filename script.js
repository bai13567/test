// 年份
document.getElementById('year').textContent = new Date().getFullYear();

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 主题切换（light / dark）
(function setupThemeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('.theme-toggle__icon');

  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') {
    root.setAttribute('data-theme', saved);
    icon.textContent = saved === 'light' ? '🌞' : '🌗';
  }

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    icon.textContent = next === 'light' ? '🌞' : '🌗';
    localStorage.setItem('theme', next);
  });
})();

// 简易 3D tilt 效果
(function setupTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(el => {
    const height = el.clientHeight;
    const width = el.clientWidth;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x - width / 2) / width) * 10; // 左右
      const rotateX = ((y - height / 2) / height) * -10; // 上下

      el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    }

    function reset() {
      el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 80ms ease-out';
    });
  });
})();

// 粒子背景
(function setupCanvas() {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = [];
  const PARTICLE_COUNT = Math.min(120, Math.floor((width * height) / 12000));
  const MAX_DISTANCE = 140;

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 绘制连接线
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const alpha = 1 - dist / MAX_DISTANCE;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // 绘制粒子
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      ctx.beginPath();
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      // 更新位置
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  draw();

  // 窗口大小改变时重置
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
})();
