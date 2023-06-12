export const enterFullscreen = () => {
  const element = document.documentElement; // Get the root element of the document
  if (element.requestFullscreen) { // Check if the requestFullscreen method is supported by the browser
    element.requestFullscreen(); // Request full screen mode
  } else if (element.mozRequestFullScreen) { // Check if the browser is Firefox
    element.mozRequestFullScreen(); // Request full screen mode
  } else if (element.webkitRequestFullscreen) { // Check if the browser is Chrome, Safari, or Opera
    element.webkitRequestFullscreen(); // Request full screen mode
  } else if (element.msRequestFullscreen) { // Check if the browser is Microsoft Edge or Internet Explorer
    element.msRequestFullscreen(); // Request full screen mode
  }
};

export const exitFullscreen = () => {
  // Check if the document is in full-screen mode
  if (!document.fullscreenElement
    && !document.webkitFullscreenElement
    && !document.mozFullScreenElement
    && !document.msFullscreenElement
  ) {
    return;
  }

  if (document.exitFullscreen) { // Check if the exitFullscreen method is supported by the browser
    document.exitFullscreen(); // Exit full screen mode
  } else if (document.mozCancelFullScreen) { // Check if the browser is Firefox
    document.mozCancelFullScreen(); // Exit full screen mode
  } else if (document.webkitExitFullscreen) { // Check if the browser is Chrome, Safari, or Opera
    document.webkitExitFullscreen(); // Exit full screen mode
  } else if (document.msExitFullscreen) { // Check if the browser is Microsoft Edge or Internet Explorer
    document.msExitFullscreen(); // Exit full screen mode
  }
};
