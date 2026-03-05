(function () {
  'use strict';
  var STORAGE_KEY = 'theme';
  var html = document.documentElement;
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    html.dataset.theme = saved;
  }

  function updateIcons(theme) {
    var isDark = theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
    });
  }

  function getEffectiveTheme() {
    var t = html.dataset.theme;
    if (t === 'dark' || t === 'light') return t;
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcons(theme);
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateIcons(getEffectiveTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark');
      });
    });

    mediaQuery.addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        updateIcons(e.matches ? 'dark' : 'light');
      }
    });
  });
}());
