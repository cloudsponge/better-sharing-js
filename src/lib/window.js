// we need a window object for these functions
// const window = this.window || {
//   document: {
//     getElementsByTagName: () => {},
//     createElement: () => {},
//   }
// }

// we need a document object for these functions
const document = window.document

// DOM utility that locates the nearest ancestor by a selector
export const findAncestor = (el, sel) => {
  while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
  return el;
}

// utility function to execute a script after the page completes loading
export const addLoadHandler = (handler) => {
  if (document.readyState == 'complete') {
    handler()
  } else if (window.addEventListener) {
    window.addEventListener("load", handler)
  } else if (document.attachEvent) {
    document.attachEvent('onload', handler)
  }
}
