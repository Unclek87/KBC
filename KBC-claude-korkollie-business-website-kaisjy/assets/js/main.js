/* ==========================================================================
   Korkollie Business Center — site behaviour
   Plain vanilla JavaScript, no libraries, no build step. Everything degrades
   gracefully: without JS the page still reads and every link still works.
   ========================================================================== */
(function () {
  'use strict';

  /** WhatsApp business line in international format (Liberia = 231, drop the leading 0). */
  var WHATSAPP_NUMBER = '231886460783';

  // Tells the failsafe in index.html that this script arrived, so it leaves the
  // reveal animations alone.
  window.__kbcReady = true;

  var on = function (el, type, fn) {
    if (el) el.addEventListener(type, fn);
  };

  /* ------------------------------------------------------------------------
     1. Current year in the footer
     ------------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------------
     2. Mobile menu
     ------------------------------------------------------------------------ */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');
    var use = menuToggle.querySelector('use');
    if (use) use.setAttribute('href', open ? '#icon-close' : '#icon-menu');
  }

  on(menuToggle, 'click', function () {
    setMenu(mobileMenu.classList.contains('hidden'));
  });

  // Close the drawer after tapping a link, and on Escape.
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      on(link, 'click', function () {
        setMenu(false);
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Header shadow once the page is scrolled
     ------------------------------------------------------------------------ */
  var header = document.getElementById('site-header');
  var lastScrollState = null;

  function syncHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 8;
    if (scrolled === lastScrollState) return;
    lastScrollState = scrolled;
    header.classList.toggle('shadow-card', scrolled);
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  /* ------------------------------------------------------------------------
     4. Fade-in on scroll
     Uses IntersectionObserver where available; otherwise everything is simply
     shown straight away.
     ------------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    revealables.forEach(function (el, i) {
      // Small stagger so cards in a row arrive one after another, not all at once.
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    revealables.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------------
     5. Gallery filter
     ------------------------------------------------------------------------ */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"][data-filter]'));
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var galleryGrid = document.getElementById('gallery-grid');
  var galleryStatus = document.getElementById('gallery-status');

  function applyFilter(filter, activeTab) {
    var shown = 0;

    galleryItems.forEach(function (item) {
      var match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) shown++;
    });

    tabs.forEach(function (tab) {
      tab.setAttribute('aria-selected', tab === activeTab ? 'true' : 'false');
    });

    if (galleryGrid && activeTab) galleryGrid.setAttribute('aria-labelledby', activeTab.id);

    if (galleryStatus) {
      galleryStatus.textContent =
        'Showing ' + shown + (shown === 1 ? ' item' : ' items') +
        (filter === 'all' ? ' — all categories.' : ' in ' + activeTab.textContent.trim() + '.');
    }
  }

  tabs.forEach(function (tab) {
    on(tab, 'click', function () {
      applyFilter(tab.dataset.filter, tab);
    });

    // Left/right arrow keys move between filters, as expected of a tab list.
    on(tab, 'keydown', function (event) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      var step = event.key === 'ArrowRight' ? 1 : -1;
      var next = tabs[(tabs.indexOf(tab) + step + tabs.length) % tabs.length];
      next.focus();
      applyFilter(next.dataset.filter, next);
    });
  });

  /* ------------------------------------------------------------------------
     6. Lightbox
     ------------------------------------------------------------------------ */
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');

  var openItems = [];
  var openIndex = 0;
  var lastFocused = null;

  function visibleItems() {
    return galleryItems.filter(function (item) {
      return !item.classList.contains('hidden');
    });
  }

  function showAt(index) {
    if (!openItems.length) return;
    openIndex = (index + openItems.length) % openItems.length;

    var img = openItems[openIndex].querySelector('img');
    var caption = openItems[openIndex].querySelector('figcaption');
    if (!img) return;

    lightboxImage.setAttribute('src', img.getAttribute('src'));
    lightboxImage.setAttribute('alt', img.getAttribute('alt') || '');
    lightboxCaption.textContent =
      (caption ? caption.textContent.trim() : '') +
      '  (' + (openIndex + 1) + ' of ' + openItems.length + ')';
  }

  function openLightbox(item) {
    if (!lightbox) return;
    openItems = visibleItems();
    lastFocused = document.activeElement;

    showAt(openItems.indexOf(item));
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  galleryItems.forEach(function (item) {
    var trigger = item.querySelector('[data-lightbox]');
    on(trigger, 'click', function () {
      openLightbox(item);
    });
  });

  on(lightboxClose, 'click', closeLightbox);
  on(lightboxPrev, 'click', function () {
    showAt(openIndex - 1);
  });
  on(lightboxNext, 'click', function () {
    showAt(openIndex + 1);
  });

  // Tapping the dark backdrop closes the viewer.
  on(lightbox, 'click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (event) {
    if (lightbox && !lightbox.classList.contains('hidden')) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showAt(openIndex - 1);
      if (event.key === 'ArrowRight') showAt(openIndex + 1);

      // Keep Tab inside the open dialog.
      if (event.key === 'Tab') {
        var stops = [lightboxClose, lightboxPrev, lightboxNext];
        var pos = stops.indexOf(document.activeElement);
        event.preventDefault();
        var step = event.shiftKey ? -1 : 1;
        stops[(Math.max(pos, 0) + step + stops.length) % stops.length].focus();
      }
      return;
    }

    if (event.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* ------------------------------------------------------------------------
     7. Quote form → pre-filled WhatsApp message
     ------------------------------------------------------------------------ */
  var form = document.getElementById('quote-form');
  var feedback = document.getElementById('form-feedback');

  // Nobody can need a job finished in the past.
  var dateField = document.getElementById('q-date');
  if (dateField) dateField.min = new Date().toISOString().slice(0, 10);

  function say(message, ok) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = 'mt-3 text-center text-sm ' + (ok ? 'text-flag-green' : 'text-flag-red');
  }

  /** Formats 2026-09-14 as "14 September 2026" — clearer than a raw ISO date in chat. */
  function humanDate(value) {
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    var monthName = months[parseInt(parts[1], 10) - 1];
    return monthName ? Number(parts[2]) + ' ' + monthName + ' ' + parts[0] : value;
  }

  on(form, 'submit', function (event) {
    event.preventDefault();

    var value = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    var name = value('q-name');
    var phone = value('q-phone');
    var service = value('q-service');

    // Guide the visitor to the first empty required field rather than failing silently.
    var missing = !name ? 'q-name' : !phone ? 'q-phone' : !service ? 'q-service' : null;
    if (missing) {
      say('Please fill in your name, phone number and the service you need.', false);
      document.getElementById(missing).focus();
      return;
    }

    var quantity = value('q-quantity');
    var neededBy = value('q-date');
    var details = value('q-details');

    var lines = [
      '*New Quote Request — Korkollie Business Center*',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Service: ' + service,
    ];
    if (quantity) lines.push('Quantity: ' + quantity);
    if (neededBy) lines.push('Needed by: ' + humanDate(neededBy));
    if (details) lines.push('', 'Details: ' + details);
    lines.push('', 'Sent from korkolliebusinesscenter.com');

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    var opened = window.open(url, '_blank', 'noopener');

    // Pop-up blockers are common on low-end Android browsers — fall back to
    // navigating the current tab so the request is never lost.
    if (!opened) {
      window.location.href = url;
      return;
    }

    say('Opening WhatsApp — press send in the chat to reach us.', true);
    form.reset();
  });
})();
