// Lightweight Lightbox for images with class "enlarge"
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const enlargeables = Array.from(document.querySelectorAll('img.enlarge'));
    if (enlargeables.length === 0) return;

    // Build overlay once
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content" role="dialog" aria-modal="true">
        <img class="lightbox-img" alt="Expanded image" />
        <button class="lightbox-close" aria-label="Zavřít">✕</button>
        <button class="lightbox-prev" aria-label="Předchozí">‹</button>
        <button class="lightbox-next" aria-label="Další">›</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('.lightbox-img');
    const btnClose = overlay.querySelector('.lightbox-close');
    const btnPrev = overlay.querySelector('.lightbox-prev');
    const btnNext = overlay.querySelector('.lightbox-next');

    let currentIndex = -1;

    function openAt(index) {
      if (index < 0 || index >= enlargeables.length) return;
      currentIndex = index;
      const src = enlargeables[currentIndex].getAttribute('src');
      const alt = enlargeables[currentIndex].getAttribute('alt') || '';
      imgEl.src = src;
      imgEl.alt = alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.classList.remove('open');
      imgEl.src = '';
      document.body.style.overflow = '';
      currentIndex = -1;
    }

    function showPrev() {
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex - 1 + enlargeables.length) % enlargeables.length;
      openAt(nextIndex);
    }

    function showNext() {
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + 1) % enlargeables.length;
      openAt(nextIndex);
    }

    // Wire up clicks on images
    enlargeables.forEach((img, i) => {
      img.style.cursor = img.style.cursor || 'zoom-in';
      img.addEventListener('click', () => openAt(i));
    });

    // Overlay interactions
    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', showPrev);
    btnNext.addEventListener('click', showNext);

    // Click outside image closes
    overlay.addEventListener('click', (e) => {
      const content = overlay.querySelector('.lightbox-content');
      if (!content.contains(e.target) || e.target === imgEl) {
        // allow clicking dark background to close; clicking image does not close
        if (!content.contains(e.target)) close();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    });
  });
})();
