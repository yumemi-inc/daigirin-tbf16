module.exports = {
  title: 'ゆめみ大技林 '/*\'23'*/,
  author: 'ゆめみ大技林製作委員会',
  language: 'ja',
  size: 'A5',
  theme: [
    'vivliostyle-theme-macneko-techbook',
    'theme/theme.css'
  ],
  entry: [
    // 目次
    'index.md',
    // はじめに
    'preface.md',
    // 各章の原稿
    'omori.md',
    'emoto.md',
    'usami.md',
    'kawashima.md',
    'iseki.md',
    'hajimism-feedback-philosophy.md',
    'yusuga.md',
    // 著者紹介
    'authors.md',
    // 奥付
    'colophon.md'
  ],
  entryContext: './manuscripts',
  output: [
    'output/ebook.pdf',
  ],
  workspaceDir: '.vivliostyle',
  toc: false,
  cover: undefined,
}
