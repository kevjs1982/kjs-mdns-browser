chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('popup.html', {
    id: 'mainWindow',
    frame: 'chrome',
    innerBounds: {
      width: 700,
      height: 450,
      minWidth: 700,
      minHeight: 450
    }
  });
});
