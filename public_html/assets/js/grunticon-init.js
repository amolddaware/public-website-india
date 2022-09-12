/* global grunticon, jQuery */
var grunticonBasePath = '/assets';
if ('localhost' === window.location.hostname) {
  grunticonBasePath = '.tmp/assets'
}
(function() {
  // https://github.com/filamentgroup/grunticon-lib/blob/b1ebc2c5e785b6be2eb74d2f1f09bda7ac6f2f83/static/grunticon.embed.cors.js
  function grunticonReady() {
    grunticon.loaded = true;
    jQuery(document).trigger('grunticon-loaded');
  }

  /**
   * Get hostname of an URL.
   *
   * @param string url
   */
  function getHostName(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
  }

  /**
   * Custom grunticon loader callback to avoid redownloading of CSS files.
   *
   * @param function callback Callback function after icons are loaded
   */
  var svgLoadedCORSCallback = function(callback) {
    if (grunticon.method !== 'svg') {
      return;
    }
    grunticon.ready(function() {
      grunticon.ajaxGet(grunticon.href, function() {
        // If stylesheet has been downloaded and embeded into the document, execute the callback and return.
        if (grunticon.loaded) {
          if (typeof callback === 'function') {
            callback();
          }
          return;
        }
        var style = document.createElement('style');
        style.setAttribute('data-src', grunticon.href);
        style.innerHTML = this.responseText;
        // If there is a linked CSS with same href, remove it to avoid conflict.
        var ref = grunticon.getCSS(grunticon.href);
        if (ref) {
          ref.parentNode.insertBefore(style, ref);
          ref.parentNode.removeChild(ref);
          grunticon.embedIcons(grunticon.getIcons(style));
          if (typeof callback === 'function') {
            callback();
          }
        }
      });
    });
  };

  // Determine which callback to use by checking the domain.
  let callback = grunticon.svgLoadedCallback;
  if (window.location.hostname !== getHostName(grunticonBasePath)) {
    callback = svgLoadedCORSCallback;
  }

  grunticon(
    [
      grunticonBasePath + '/icons/icons.data.svg.css',
      grunticonBasePath + '/icons/icons.data.png.css',
      grunticonBasePath + '/icons/icons.fallback.css'
    ],
    () => callback(grunticonReady)
  );
})();
