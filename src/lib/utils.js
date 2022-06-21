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

export const hijackFn = (obj, fn, cb, impl) => {
  impl ||= () => {
    console.log('hijacked ', obj.toString(), fn)
  }
  const orig = obj[fn]
  try {
    obj[fn] = impl
    cb()
  } finally {
    obj[fn] = orig
  }
}

export const parseQuery = (query) => {
  const obj = {}
  query = trimTo(query || '', '?')
  while (query) {
    query = mergeNextQueryPair(query, obj)
  }
  return obj
}

const mergeNextQueryPair = (query, obj) => {
  const nextNameVal = divString(query, '=')
  const name = decodeURIComponent(nextNameVal[0])

  const valAndRemainder = divString(nextNameVal[1], '&')

  const val = decodeURIComponent(valAndRemainder[0])
  const remainder = valAndRemainder[1]
  obj[name] = val
  return remainder
}

const trimTo = (str, char) => {
  const start = str.indexOf(char)
  if (start > 0) {
    return str.slice(start + 1)
  }
  return str
}

const divString = (str, char) => {
  const divIndex = str.indexOf(char)
  if (divIndex > 0) {
    return [str.slice(0, divIndex), str.slice(divIndex + 1)]
  }
  return [str, null]
}
