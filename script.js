/**
 * ════════════════════════════════════════════════
 * HYPIX RID — Gaming Channel Website
 * script.js — Dynamic YouTube RSS + UI Logic
 *
 * Features:
 *  - Fetches latest 6 videos via YouTube RSS feed
 *  - Uses a CORS proxy so it works from GitHub Pages
 *  - Featured (latest) video rendered separately
 *  - Navbar scroll effect
 *  - Animated particle canvas background
 *  - Hamburger mobile menu
 * ════════════════════════════════════════════════
 */

/* ── Constants ── */
const CHANNEL_ID  = 'UC_Np9zl2rDt-mudleJTC1Ow';
const CHANNEL_URL = 'https://www.youtube.com/@HypixRid';
const RSS_URL     = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// CORS proxy — rss2json converts the XML feed to JSON
const PROXY_URL   = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=&count=7`;

const MAX_GRID_VIDEOS = 6; // videos shown in the grid (latest excluded)

/* ════════════════════════════════════════════════
   NAVBAR — Scroll Effect
════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ════════════════════════════════════════════════
   HAMBURGER — Mobile Menu
════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close menu when a link inside is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ════════════════════════════════════════════════
   FOOTER — Year
════════════════════════════════════════════════ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ════════════════════════════════════════════════
   CANVAS — Particle Background
════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      // Mostly dim, occasionally bright red or cyan
      color: Math.random() > 0.85
        ? (Math.random() > 0.5 ? 'rgba(255,45,45,' : 'rgba(0,229,255,')
        : 'rgba(255,255,255,',
      alpha: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 8000), 120);
    particles = Array.from({ length: count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -2) p.x = W + 2;
      if (p.x > W + 2) p.x = -2;
      if (p.y < -2) p.y = H + 2;
      if (p.y > H + 2) p.y = -2;
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();

/* ════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════ */

/**
 * Extract YouTube video ID from a URL
 * Handles: watch?v=, youtu.be/, shorts/
 */
function getVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/**
 * Return a hq thumbnail URL for a given video ID
 */
function thumbUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Format an ISO date string to a readable form
 */
function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Strip HTML tags from a string (for titles)
 */
function stripHtml(str) {
  const tmp = document.createElement('div');
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || '';
}

/* ════════════════════════════════════════════════
   RENDER — Featured Video
════════════════════════════════════════════════ */
function renderFeatured(video) {
  const vidId = getVideoId(video.link);
  if (!vidId) return;

  const card = document.getElementById('featuredCard');
  card.innerHTML = `
    <a href="${video.link}" target="_blank" rel="noopener" class="featured-thumb-wrap" aria-label="Watch ${stripHtml(video.title)}">
      <img
        src="${thumbUrl(vidId)}"
        alt="${stripHtml(video.title)}"
        class="featured-thumb"
        loading="eager"
        onerror="this.src='https://placehold.co/800x450/0d1018/ff2d2d?text=Watch+on+YouTube'"
      />
      <div class="featured-play-btn">
        <div class="play-circle">
          <!-- Play icon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </a>
    <div class="featured-info">
      <span class="featured-badge">🔴 Latest Video</span>
      <h2 class="featured-title">${stripHtml(video.title)}</h2>
      <p class="featured-date">📅 ${formatDate(video.pubDate)}</p>
      <a href="${video.link}" target="_blank" rel="noopener" class="btn btn-primary" style="align-self:flex-start;margin-top:8px;">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        Watch Now
      </a>
    </div>
  `;
}

/* ════════════════════════════════════════════════
   RENDER — Video Grid
════════════════════════════════════════════════ */
function renderGrid(videos) {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = ''; // Clear skeleton cards

  if (!videos.length) {
    showError();
    return;
  }

  videos.forEach((video, i) => {
    const vidId = getVideoId(video.link);
    if (!vidId) return;

    const card = document.createElement('a');
    card.href     = video.link;
    card.target   = '_blank';
    card.rel      = 'noopener';
    card.className = 'video-card glass';
    card.style.animationDelay = `${i * 0.07}s`;
    card.setAttribute('aria-label', `Watch: ${stripHtml(video.title)}`);

    card.innerHTML = `
      <div class="card-thumb-wrap">
        <img
          src="${thumbUrl(vidId)}"
          alt="${stripHtml(video.title)}"
          class="card-thumb"
          loading="lazy"
          onerror="this.src='https://placehold.co/480x270/0d1018/ff2d2d?text=Watch+on+YouTube'"
        />
        <div class="card-overlay">
          <div class="card-play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${stripHtml(video.title)}</h3>
        <p class="card-meta">📅 ${formatDate(video.pubDate)}</p>
        <span class="card-watch-btn">Watch →</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ════════════════════════════════════════════════
   ERROR STATE
════════════════════════════════════════════════ */
function showError() {
  document.getElementById('videoGrid').innerHTML = '';
  document.getElementById('errorState').classList.remove('hidden');

  // Also clear featured card
  const featuredCard = document.getElementById('featuredCard');
  featuredCard.innerHTML = `
    <div style="padding:40px;text-align:center;width:100%;color:var(--text-muted);">
      <p style="margin-bottom:16px;">Couldn't load latest video.</p>
      <a href="${CHANNEL_URL}" target="_blank" rel="noopener" class="btn btn-outline">Visit Channel →</a>
    </div>
  `;
}

/* ════════════════════════════════════════════════
   FETCH — YouTube RSS via rss2json proxy
════════════════════════════════════════════════ */
async function fetchVideos() {
  try {
    // rss2json is a free public API that converts RSS → JSON with CORS headers
    const res = await fetch(PROXY_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) {
      throw new Error('Bad data from proxy');
    }

    const items = data.items; // Already sorted newest-first

    // First item → featured
    renderFeatured(items[0]);

    // Next MAX_GRID_VIDEOS → grid (skip item[0] which is featured)
    const gridItems = items.slice(1, MAX_GRID_VIDEOS + 1);
    renderGrid(gridItems);

  } catch (err) {
    console.error('[HypixRid] Failed to load videos:', err);
    showError();
  }
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fetchVideos();
});
