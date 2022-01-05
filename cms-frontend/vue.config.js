module.exports = {
  // 建置前端靜態檔案時要擺放的目錄
  // 在 package.json 也要調整 "build" 這個 script
  outputDir: '../public',
  // compile 的檔案 outputDir 下的資料夾名稱
  assetsDir: 'site-build',
  // 開發階段修改 index.html 來讓 js/css 可以作用
  // 上線階段則會修改 Laravel 的樣版
  indexPath:
    process.env.NODE_ENV === 'production'
      ? '../resources/views/site/index.blade.php'
      : 'index.html',

  runtimeCompiler: true,
};
