export const addJavascript = (src, id, callback) => {
  if (id) {
    const scriptEl = document.getElementById(id)
    if (scriptEl) {
      if (callback) {
        callback()
      }
      return
    }
  }

  const script = document.createElement('script')
  script.async = 1
  script.src = src
  if (id) {
    script.id = id
  }

  // for name, val of attrs || {}
  //   a.setAttribute(name, val)

  // set the script to invoke a callback after it loads
  if (callback) {
    if (script.readyState) {
      // IE7+
      script.onreadystatechange = () => {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null
          callback()
        }
      }
    } else {
      script.onload = () => {
        // Other browsers
        callback()
      }
    }
  }

  // add the script to the page
  const m = document.getElementsByTagName('script')[0]
  m.parentNode.insertBefore(script, m)
}
