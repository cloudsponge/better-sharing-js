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
  } else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", handler)
  } else if (document.attachEvent) {
    document.attachEvent('onload', handler)
  }
}

// converts a JSON object (or string) to a string of CSS
export const objToCss = (obj) => {
  var cssString = JSON.stringify(obj)
            .replace(/"/g,'')
            .replace(/,/g,';')
            .replace(/^\{/,'')
            .replace(/\}$/,'');
  if (cssString.length > 0) {
    cssString = cssString + ';';
  }
  return cssString;
}
