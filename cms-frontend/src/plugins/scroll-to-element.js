// import Vue from 'vue'

function isScrollable($el) {
  // Compare the height to see if the element has scrollable content
  const hasScrollableContent = $el.scrollHeight > $el.clientHeight

  // It's not enough because the element's `overflow-y` style can be set as
  // * `hidden`
  // * `hidden !important`
  // In those cases, the scrollbar isn't shown
  const overflowYStyle = window.getComputedStyle($el).overflowY;

  const isOverflowYScroll = ['scroll',
    'auto'].includes(overflowYStyle);

  return hasScrollableContent && isOverflowYScroll
}

function findScrollableContainer($el) {
  if($el === null) {
    return
  }
  if(!isScrollable($el)) {
    return findScrollableContainer($el.parentElement)
  } else {
    return $el
  }
}

function findPos(el) {
  var curtop = 0
  if(el.offsetParent) {
    do {
      curtop += el.offsetTop
    }
    while ((el = el.offsetParent))
    return curtop
  }
}

/* Vue.prototype.$scrollToElement = function scrollToElement({
  $el,
  y,
  offset = 0,
  position = 'top',
  speed = 0.6
} = {}) {

  const defaultContainer = window;
  const container = $el
    ? (findScrollableContainer($el) || defaultContainer)
    : defaultContainer;
  const scrollOffset = position === 'center'
    ? (document.body.clientHeight / 2) + offset
    : offset;

  const scrollToY = y ?? (findPos($el) - scrollOffset);

  TweenMax.to(container, speed, {
    scrollTo: {
      y: scrollToY,
      autoKill: true
    },
    ease: Power3.easeOut
  });
}; */
export default function scrollToElement({
  $el,
  y,
  offset = 0,
  position = 'top',
  speed = 0.6
} = {}) {

  const defaultContainer = window;
  const container = $el
    ? (findScrollableContainer($el) || defaultContainer)
    : defaultContainer;
  const scrollOffset = position === 'center'
    ? (document.body.clientHeight / 2) + offset
    : offset;

  const scrollToY = y ?? (findPos($el) - scrollOffset);

  TweenMax.to(container, speed, {
    scrollTo: {
      y: scrollToY,
      autoKill: true
    },
    ease: Power3.easeOut
  });
};


