(function () {
  'use strict';
  var STORAGE_KEY = 'theme';
  var html = document.documentElement;

  /* Apply saved preference synchronously to prevent FOUC */
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    html.dataset.theme = saved;
  }

  function getEffectiveTheme() {
    var t = html.dataset.theme;
    if (t === 'dark' || t === 'light') return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    syncButtons(theme);
  }

  function syncButtons(theme) {
    var isDark = theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncButtons(getEffectiveTheme());
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark');
      });
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        syncButtons(e.matches ? 'dark' : 'light');
      }
    });
  });
}());
