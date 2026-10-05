// ============================================================
//  Remote blog posts — pulls "Blog Posts" tab from the Google
//  Sheet (via the Apps Script endpoint) and merges them into
//  window.BLOG_POSTS. Sheet posts override same-slug local ones.
//  window.BLOG_READY resolves once the merge is done (or failed).
// ============================================================
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxt36FZOHPwdrjdidcuvIVkGFo_o1K4Hgi5K6LT6U0KUaiZ0j_4McNHMNZH4ZYfa3BJ/exec';
  window.BLOG_POSTS = window.BLOG_POSTS || {};

  // Parse the Body cell: "## " → heading, "- " → list items, blank-line paragraphs
  function parseBody(text) {
    var blocks = [];
    var lines = String(text || '').replace(/\r/g, '').split('\n');
    var para = [], list = null;
    function flushPara() {
      if (para.length) { blocks.push({ p: para.join(' ').trim() }); para = []; }
    }
    function flushList() {
      if (list && list.length) blocks.push({ list: list });
      list = null;
    }
    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) { flushPara(); flushList(); return; }
      if (line.indexOf('## ') === 0) {
        flushPara(); flushList();
        blocks.push({ h2: line.slice(3).trim() });
      } else if (line.indexOf('- ') === 0 || line.indexOf('* ') === 0) {
        flushPara();
        list = list || [];
        list.push(line.slice(2).trim());
      } else {
        flushList();
        para.push(line);
      }
    });
    flushPara(); flushList();
    return blocks;
  }

  function merge(data) {
    if (!data || !data.ok || !Array.isArray(data.posts)) return [];
    var added = [];
    data.posts.forEach(function (p) {
      if (!p.slug || !p.title) return;
      window.BLOG_POSTS[p.slug] = {
        title: p.title,
        category: p.category,
        date: p.date,
        read: p.read,
        hero: p.hero || 'images/gym-room-opt.jpg',
        excerpt: p.excerpt,
        body: parseBody(p.bodyText),
        remote: true
      };
      added.push(p.slug);
    });
    return added;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  // On the blog index: prepend cards for sheet posts (newest first)
  function renderCards(slugs) {
    var grid = document.querySelector('.blog-grid');
    if (!grid || !slugs.length) return;
    slugs.reverse().forEach(function (slug) {
      if (grid.querySelector('[href="/blog-post?post=' + slug + '"]')) return;
      var p = window.BLOG_POSTS[slug];
      var a = document.createElement('a');
      a.className = 'bcard';
      a.href = '/blog-post?post=' + slug;
      a.innerHTML =
        '<div class="bcard__img"><img loading="lazy" decoding="async" src="' + esc(p.hero) + '" alt="' + esc(p.title) + '" /></div>' +
        '<div class="bcard__body">' +
          '<div class="bcard__meta"><span>' + esc(p.category) + '</span><span class="dot"></span><span>' + esc(p.read) + '</span></div>' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<p>' + esc(p.excerpt) + '</p>' +
          '<span class="bcard__more">Read More' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>' +
          '</span>' +
        '</div>';
      grid.insertBefore(a, grid.firstChild);
    });
  }

  window.BLOG_READY = fetch(ENDPOINT + '?posts=1')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var added = merge(data);
      renderCards(added);
      return added;
    })
    .catch(function () { return []; });
})();
