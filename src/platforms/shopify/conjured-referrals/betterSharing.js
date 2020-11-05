import { addJavascript } from '../../../lib/utils'
import { findAncestor } from '../../../lib/window'
import options, { defaults, afterUpdateOptions } from '../../../lib/scriptOptions'
import svg from './icon.svg'
import template from './template.html'

// const containerClass = 'better-sharing-container'

defaults({
  // the css class for the element that will wrap the input that we get attached to
  containerClass: 'better-sharing-container',
})

const isReady = () => {
  if (document.getElementById('conjured_advocate_share_email')) {
    return true
  }
  return false
}

const whenReady = (executable, times=0) => {
  if (isReady()) {
    executable()
  } else if (times < 10) {
    // check again in 1 second, to a maximum of 10 seconds
    setTimeout(() => whenReady(executable, times+1), 1000)
  } else {
    // well, something messed up and we couldn't find what we needed so
    //  give up and let the console know about it...
    console.log('[betterSharing] unable to load, not ready.')
  }
}

// 1. initialization of the cloudsponge script
// 2. initialization of the UI
const init = () => {
  const { key, selector, containerClass } = options()
  // add the cloudsponge contact picker to the page
  if (key) {
    // add the cloudsponge javascript
    addJavascript(`https://api.cloudsponge.com/widget/${key}.js`, 'cloudsponge-script', () => {
      // initialize the cloudsponge object here since we may be calling this function a subsequent time
      cloudsponge.init()
    })
  }

  if (selector) {
    // add a button to the page
    const targetInput = document.querySelector(selector)
    if (targetInput && !findAncestor(targetInput, `.${containerClass}`)) {
      targetInput.classList.add('cloudsponge-contacts')
      const outerHTML = template({svg, containerClass, targetInput})

      // wrap the given input and add the tag
      targetInput.outerHTML = outerHTML
    }
  }
}

const betterSharing = (opts={}) => {
  // merge the options in
  options(opts)
  // check if the preconditions exist for initializing
  whenReady(init)
}

// expose the options
betterSharing.options = options

afterUpdateOptions(betterSharing)

betterSharing()

// usage:
//  contactPicker({selector: '#conjured_emails', key: '-GlOh6uaT0OvNi51EhGNsQ'})
export default betterSharing

// document.querySelector('script[src^="https://app.conjured.co/shopify/referral/widget.js"]')
