// this module is a generic way to handle capturing options as a script is added to a page
// read the script options from:
// * declared default or config
// * the current script's data attributes
// * applied via function
// each takes precedence over the next

const defaultOptions    = {}
const immutableDefaults = {}
const scriptDataOptions = {}
const appliedOptions    = {}
let   currentOptions    = {}
const afterUpdateCallbacks = []


// 
const updateOptions = (optionSet, args) => {
  // optionSet is a refernce to the private member
  Object.assign(optionSet, args)
  // since one of the private sets update, we'll apply them all now
  currentOptions = Object.assign({}, defaultOptions, scriptDataOptions, appliedOptions, immutableDefaults)

  executeAfterCallback()
  return currentOptions
}

const executeAfterCallback = () => {
  afterUpdateCallbacks.forEach((cb) => cb(currentOptions))
}

export const afterUpdateOptions = callback => {
  afterUpdateCallbacks.push(callback)
}

// get a reference to the currently executing script
//  we start by looking for the currentScript which is support by most browsers (except IE)
//  but can also be defeated if this code executes in a callback. so to be clever, we're going to
//  check for any script with a bettersharing-* data attribute or a script that includes a better-sharing.js built file
const thisScript =
    document.currentScript || // most browsers support currentScript, which is nice and easy
    document.querySelector('[data-better-sharing-key]') || // IE does not so we'll look for any script with our expected data attribute
    Array.from(document.querySelectorAll('script')).find(script => { // failing that, we'll look for the script based on it containing any data-bettersharing-* attributes
      return script.src.match(/better-sharing[^\/]+\.js/) || Object.keys(script.dataset).find(key => key.startsWith('betterSharing'))
    })

if (thisScript) {
  updateOptions(scriptDataOptions, thisScript.dataset)
}

// sets the default options for this instance and returns the full set of defaults
export const defaults = (args=null, immutable=false) => {
  if (args) {
    if (immutable) {
      updateOptions(immutableDefaults, args)
      return immutableDefaults
    }
    updateOptions(defaultOptions, args)
  }
  return defaultOptions
}

// sets the appliedOptions, calculates and returns the currentOptions
const options = (args=null) => {
  if (args) {
    return updateOptions(appliedOptions, args)
  }
  return currentOptions
}

export default options
