/**
 * 設定瀏覽器 History
 * @param data
 * @param title
 * @param query
 */
export default function setWindowHistory({
  data = {},
  title = '',
  query = {}
} = {}) {
  // 這邊可以修改網址的參數 如果用$route.query是拿不到被動態改變的值 可以改成用getUrlParameter取query
  const url = new URL(window.location);

  Object.keys(query)
    .forEach(key => {
      if(query[key] === undefined) {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, query[key]);
      }
    });

  window.history.pushState(data, title, url);
}

/**
 * 取得網址參數
 * @param name
 * @returns {string|string}
 */
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[')
    .replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
