/* =========================================================
   Portfolio · lógica
   Todo el contenido sale de data/profile.json y data/projects.json.
   Para agregar un proyecto NO hace falta tocar este archivo.
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const ICONS = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13zm2.3-.5L12 11.1 19.7 5H4.3zM20 6.6l-7.38 5.85a1 1 0 0 1-1.24 0L4 6.6v11.9c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V6.6z"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 9h-3a15.6 15.6 0 0 0-1.4-5.6A8 8 0 0 1 18.93 11zM12 4.04c.83 1.2 1.83 3.5 1.97 6.96h-3.94C10.17 7.54 11.17 5.24 12 4.04zM9.47 5.4A15.6 15.6 0 0 0 8.07 11h-3a8 8 0 0 1 4.4-5.6zM5.07 13h3a15.6 15.6 0 0 0 1.4 5.6 8 8 0 0 1-4.4-5.6zM12 19.96c-.83-1.2-1.83-3.5-1.97-6.96h3.94c-.14 3.46-1.14 5.76-1.97 6.96zm2.53-1.36a15.6 15.6 0 0 0 1.4-5.6h3a8 8 0 0 1-4.4 5.6z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    images: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v9h12V7H4zm16 2h2v10a2 2 0 0 1-2 2H6v-2h14V9z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  };

  const state = { profile: null, projects: [], filter: 'Todos', current: null, index: 0 };

  /* ---------------- Utilidades ---------------- */
  function fmtDate(ym) {
    if (!ym) return '';
    const [y, m] = String(ym).split('-');
    return m ? `${MONTHS[Number(m) - 1] ?? ''} ${y}` : y;
  }

  function youtubeId(item) {
    if (item.id) return item.id;
    const m = String(item.src || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/);
    return m ? m[1] : '';
  }

  function mediaThumb(item) {
    if (!item) return '';
    if (item.type === 'youtube') return `https://i.ytimg.com/vi/${youtubeId(item)}/hqdefault.jpg`;
    if (item.type === 'video') return item.poster || '';
    return item.src;
  }

  /* ---------------- Perfil ---------------- */
  function renderProfile(p) {
    document.title = `${p.name} · ${p.role}`;
    $('#brand-initials').textContent = p.initials || p.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
    $('#brand-name').textContent = p.name;
    $('#footer-name').textContent = p.name;
    $('#year').textContent = new Date().getFullYear();

    $('#hero-eyebrow').textContent = [p.role, p.location].filter(Boolean).join(' · ');
    const hl = p.headlineHighlight;
    const headline = esc(p.headline || '');
    $('#hero-headline').innerHTML = hl ? headline.replace(esc(hl), `<span class="hl">${esc(hl)}</span>`) : headline;
    $('#hero-bio').textContent = p.bio || '';

    if (p.cv) { const cv = $('#cv-link'); cv.href = p.cv; cv.hidden = false; }

    const links = [];
    if (p.socials?.linkedin) links.push(['linkedin', p.socials.linkedin, 'LinkedIn']);
    if (p.socials?.github) links.push(['github', p.socials.github, 'GitHub']);
    if (p.socials?.web) links.push(['web', p.socials.web, 'Sitio web']);
    if (p.email) links.push(['email', `mailto:${p.email}`, 'Email']);
    $('#hero-socials').innerHTML = links
      .map(([k, url, label]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${label}" title="${label}">${ICONS[k]}</a></li>`)
      .join('');

    // Skills
    $('#skills-list').innerHTML = (p.skills || [])
      .map((g) => `<div class="skill-group reveal"><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`)
      .join('');

    // Experiencia
    $('#timeline').innerHTML = (p.experience || [])
      .map((e) => `
        <li class="tl reveal">
          <p class="tl__period">${esc(e.period)}</p>
          <h3 class="tl__role">${esc(e.role)}</h3>
          ${e.org ? `<p class="tl__org">${esc(e.org)}</p>` : ''}
          ${e.description ? `<p class="tl__desc">${esc(e.description)}</p>` : ''}
        </li>`)
      .join('');

    // Contacto
    $('#contact-text').textContent = p.contactText || '';
    const actions = [];
    if (p.email) actions.push(`<a class="btn btn--primary" href="mailto:${esc(p.email)}">${ICONS.email.replace('<svg', '<svg style="fill:currentColor;stroke:none"')} Escribime</a>`);
    if (p.socials?.linkedin) actions.push(`<a class="btn ${p.email ? 'btn--ghost' : 'btn--primary'}" href="${esc(p.socials.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (p.socials?.github) actions.push(`<a class="btn btn--ghost" href="${esc(p.socials.github)}" target="_blank" rel="noopener">GitHub</a>`);
    $('#contact-actions').innerHTML = actions.join('');
  }

  /* ---------------- KPIs y gráfico del hero ---------------- */
  function renderOverview() {
    const { projects, profile } = state;
    const counts = {};
    projects.forEach((pr) => (pr.tools || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const tools = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    const third = $('#kpi-years');
    let thirdValue;
    if (profile.careerStartYear) {
      thirdValue = Math.max(1, new Date().getFullYear() - Number(profile.careerStartYear));
    } else {
      third.previousElementSibling.textContent = 'Skills';
      thirdValue = (profile.skills || []).reduce((n, g) => n + g.items.length, 0);
    }
    countUp($('#kpi-projects'), projects.length);
    countUp($('#kpi-tools'), tools.length);
    countUp(third, thirdValue);

    const max = tools[0]?.[1] || 1;
    const bars = $('#tool-bars');
    bars.innerHTML = tools.slice(0, 5)
      .map(([t, n]) => `
        <div class="bar" title="${esc(t)}: ${n} proyecto${n === 1 ? '' : 's'}">
          <span class="bar__label">${esc(t)}</span>
          <span class="bar__track"><span class="bar__fill" data-w="${(n / max) * 100}"></span></span>
          <span class="bar__value">${n}</span>
        </div>`)
      .join('') || '<p class="muted">Sin proyectos todavía.</p>';
    requestAnimationFrame(() => setTimeout(() => {
      bars.querySelectorAll('.bar__fill').forEach((b) => { b.style.width = `${b.dataset.w}%`; });
    }, 150));
  }

  function countUp(el, target) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target <= 0) { el.textContent = target; return; }
    const start = performance.now(); const dur = 900;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- Proyectos ---------------- */
  function renderFilters() {
    const tools = [...new Set(state.projects.flatMap((p) => p.tools || []))].sort((a, b) => a.localeCompare(b));
    const all = ['Todos', ...tools];
    $('#filters').innerHTML = all
      .map((t) => `<button type="button" class="chip" data-filter="${esc(t)}" aria-pressed="${t === state.filter}">${esc(t)}</button>`)
      .join('');
  }

  function cardMedia(p) {
    const c = p.cover || p.media?.[0];
    if (!c) return '';
    if (c.type === 'video') {
      return `<video src="${esc(c.src)}" ${c.poster ? `poster="${esc(c.poster)}"` : ''} muted loop playsinline preload="metadata"></video>`;
    }
    const src = mediaThumb(c);
    return src ? `<img src="${esc(src)}" alt="${esc(c.alt || p.title)}" loading="lazy">` : '';
  }

  function cardBadge(p) {
    const media = p.media || [];
    const videos = media.filter((m) => m.type !== 'image').length;
    if (videos) return `<span class="card__badge">${ICONS.play} ${videos} video${videos > 1 ? 's' : ''}</span>`;
    if (media.length > 1) return `<span class="card__badge">${ICONS.images} ${media.length} imágenes</span>`;
    return '';
  }

  function renderProjects() {
    const list = state.filter === 'Todos' ? state.projects : state.projects.filter((p) => (p.tools || []).includes(state.filter));
    $('#projects-empty').hidden = list.length > 0;
    $('#projects-grid').innerHTML = list
      .map((p) => `
        <button type="button" class="card reveal" data-id="${esc(p.id)}" aria-label="Ver proyecto: ${esc(p.title)}">
          <div class="card__media">
            ${cardMedia(p)}
            ${cardBadge(p)}
            ${p.featured ? '<span class="card__badge card__featured">Destacado</span>' : ''}
          </div>
          <div class="card__body">
            <h3 class="card__title">${esc(p.title)}</h3>
            <p class="card__summary">${esc(p.summary)}</p>
            <div class="tags">${(p.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
            <span class="card__more">Ver proyecto →</span>
          </div>
        </button>`)
      .join('');

    // Videos de portada: reproducen al pasar el mouse
    $('#projects-grid').querySelectorAll('.card').forEach((card) => {
      const v = card.querySelector('video');
      if (!v) return;
      card.addEventListener('mouseenter', () => v.play().catch(() => {}));
      card.addEventListener('mouseleave', () => { v.pause(); });
    });
    observeReveal();
  }

  /* ---------------- Modal y galería ---------------- */
  function openProject(id) {
    const p = state.projects.find((x) => x.id === id);
    if (!p) return;
    state.current = p; state.index = 0;

    $('#modal-date').textContent = fmtDate(p.date);
    $('#modal-title').textContent = p.title;
    $('#modal-tags').innerHTML = (p.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
    const desc = Array.isArray(p.description) ? p.description : [p.description || p.summary];
    $('#modal-desc').innerHTML = desc.map((d) => `<p>${esc(d)}</p>`).join('');
    $('#modal-highlights').innerHTML = (p.highlights || [])
      .map((h) => `<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join('');
    $('#modal-links').innerHTML = (p.links || [])
      .map((l, i) => `<a class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${ICONS.ext}</a>`)
      .join('');

    const media = mediaList(p);
    $('#gallery-thumbs').innerHTML = media.length > 1
      ? media.map((m, i) => {
          const t = mediaThumb(m);
          return `<button type="button" class="thumb" data-i="${i}" aria-label="Ver elemento ${i + 1}">${t ? `<img src="${esc(t)}" alt="">` : ''}${m.type !== 'image' ? '<span>▶</span>' : ''}</button>`;
        }).join('')
      : '';
    showMedia(0);

    const modal = $('#project-modal');
    modal.showModal();
    modal.querySelector('.modal__inner').scrollTop = 0;
    history.replaceState(null, '', `#proyecto/${p.id}`);
  }

  function mediaList(p) {
    const m = p.media && p.media.length ? p.media : (p.cover ? [p.cover] : []);
    return m;
  }

  function showMedia(i) {
    const media = mediaList(state.current);
    if (!media.length) { $('#gallery-stage').innerHTML = ''; return; }
    state.index = (i + media.length) % media.length;
    const m = media[state.index];
    const stage = $('#gallery-stage');
    if (m.type === 'video') {
      stage.innerHTML = `<video src="${esc(m.src)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} controls playsinline preload="metadata"></video>`;
    } else if (m.type === 'youtube') {
      stage.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(youtubeId(m))}?rel=0" title="${esc(m.caption || state.current.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    } else {
      stage.innerHTML = `<img src="${esc(m.src)}" alt="${esc(m.alt || m.caption || state.current.title)}">`;
    }
    $('#gallery-caption').textContent = m.caption || '';
    const multi = media.length > 1;
    $('#gallery-prev').hidden = !multi;
    $('#gallery-next').hidden = !multi;
    $('#gallery-thumbs').querySelectorAll('.thumb').forEach((t) => t.setAttribute('aria-current', String(Number(t.dataset.i) === state.index)));
  }

  function closeModal() {
    const modal = $('#project-modal');
    $('#gallery-stage').innerHTML = ''; // corta videos en reproducción
    if (modal.open) modal.close();
    if (location.hash.startsWith('#proyecto/')) history.replaceState(null, '', '#proyectos');
  }

  /* ---------------- Tema ---------------- */
  function initTheme() {
    $('#theme-toggle').addEventListener('click', () => {
      const root = document.documentElement;
      const isDark = root.dataset.theme
        ? root.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = isDark ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    });
  }

  /* ---------------- Animaciones ---------------- */
  let io;
  function observeReveal() {
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-visible')); return; }
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ---------------- Eventos ---------------- */
  function bindEvents() {
    $('#filters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      state.filter = b.dataset.filter;
      $('#filters').querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      renderProjects();
    });
    $('#projects-grid').addEventListener('click', (e) => {
      const c = e.target.closest('.card');
      if (c) openProject(c.dataset.id);
    });
    const modal = $('#project-modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) closeModal();
    });
    modal.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(); });
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') showMedia(state.index + 1);
      if (e.key === 'ArrowLeft') showMedia(state.index - 1);
    });
    $('#gallery-prev').addEventListener('click', () => showMedia(state.index - 1));
    $('#gallery-next').addEventListener('click', () => showMedia(state.index + 1));
    $('#gallery-thumbs').addEventListener('click', (e) => {
      const t = e.target.closest('.thumb');
      if (t) showMedia(Number(t.dataset.i));
    });
  }

  /* ---------------- Inicio ---------------- */
  async function init() {
    initTheme();
    bindEvents();
    try {
      const [profile, projects] = await Promise.all([
        fetch('data/profile.json').then((r) => r.json()),
        fetch('data/projects.json').then((r) => r.json()),
      ]);
      state.profile = profile;
      state.projects = projects
        .filter((p) => !p.hidden)
        .sort((a, b) => (b.featured === true) - (a.featured === true) || String(b.date).localeCompare(String(a.date)));
      renderProfile(profile);
      renderOverview();
      renderFilters();
      renderProjects();
      observeReveal();

      const m = location.hash.match(/^#proyecto\/(.+)$/);
      if (m) openProject(decodeURIComponent(m[1]));
    } catch (err) {
      console.error(err);
      $('#projects-grid').innerHTML = '<p class="muted">No se pudieron cargar los datos. Si abriste el archivo directo desde la carpeta, usá un servidor local (ver README).</p>';
    }
  }

  init();
})();
