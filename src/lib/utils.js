export const addJavascript = (src, id, callback) => {
  if (id) {
    const scriptEl = document.getElementById(id)
    if (scriptEl) {
      if (callback) {
        callback()
      }
      return scriptEl
    }
  }

  const script = document.createElement('script')
  script.src = src
  if (id) {
    script.id = id
  }

  let done = false

  // set the script to invoke a callback after it loads
  if (callback) {
    script.onload = script.onreadystatechange = () => {
      if (
        !done &&
        (!script.readyState ||
          script.readyState === 'loaded' ||
          script.readyState === 'complete')
      ) {
        done = true
        script.onload = script.onreadystatechange = null
        callback()
      }
    }
  }

  // add the script to the page
  // const m = document.getElementsByTagName('script')[0]
  const m =
    document.getElementsByTagName('head')[0] ||
    document.documentElement.children[0]
  m.parentNode.insertBefore(script, m)

  return script
}
