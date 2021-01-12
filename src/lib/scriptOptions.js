// this module is a generic way to handle capturing options as a script is added to a page
// read the script options from:
// * declared default or config
// * the current script's data attributes
// * applied via function
// each takes precedence over the next

// default options set internally that may be overwritten
const defaultOptions = {}
// default options set internally which may not be overwritten
const immutableDefaults = {}
// options specified in the script's data-* attributes
const scriptDataOptions = {}
// options applied with the options() function
const appliedOptions = {}
// the currently computed options
let currentOptions = {}
// callbacks to be executed after the options are updated anytime
const afterUpdateCallbacks = []
// state var to prevent infinite recursion
let updatingOptions = false

export const resetOptions = (optionSet) => {
  Object.keys(optionSet).forEach((key) => {
    delete optionSet[key]
  })
  return updateOptions()
}

export const reset = () => {
  resetOptions(appliedOptions)
  return updateOptions()
}

//
const updateOptions = (optionSet, args) => {
  // optionSet is a refernce to the private member
  if (optionSet) {
    Object.assign(optionSet, args)
  }
  // since one of the private sets update, we'll apply them all now
  currentOptions = Object.assign(
    {},
    defaultOptions,
    scriptDataOptions,
    appliedOptions,
    immutableDefaults
  )

  if (!updatingOptions) {
    updatingOptions = true
    try {
      executeAfterCallback()
    } catch (e) {
      // do nada
    }
    updatingOptions = false
  }

  return currentOptions
}

const executeAfterCallback = () => {
  afterUpdateCallbacks.forEach((cb) => cb(currentOptions))
}

export const afterUpdateOptions = (callback) => {
  afterUpdateCallbacks.push(callback)
}

export const init = () => {
  // get a reference to the currently executing script
  //  we start by looking for the currentScript which is support by most browsers (except IE)
  //  but can also be defeated if this code executes in a callback. so to be clever, we're going to
  //  check for any script with a bettersharing-* data attribute or a script that includes a better-sharing.js built file
  const thisScript =
  // document.currentScript || // most browsers support currentScript, which is nice and easy but is problematic when the script is added dynamically so:
    document.querySelector('script[data-key][src*=better-sharing], script[data-better-sharing-key]') || // if the current script is unavailable, lets look for any script matching our install instructions
    Array.from(document.querySelectorAll('script')).find((script) => {
      // failing that, we'll look for the script based on it containing any data-bettersharing-* attributes
      return (
        script.src.match(/better-sharing[^\/]+\.js/) ||
        Object.keys(script.dataset).find((key) =>
          key.startsWith('betterSharing')
        )
      )
    })

  if (thisScript) {
    updateOptions(scriptDataOptions, thisScript.dataset)
  }
  return scriptDataOptions
}
// always initialize thisScript and get its options as we load this file
init()

// sets the default options for this instance and returns the full set of defaults
export const defaults = (args = null, immutable = false) => {
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
const options = (args = null) => {
  if (args) {
    return updateOptions(appliedOptions, args)
  }
  return currentOptions
}

// export the init function as well
options.init = init

export default options
