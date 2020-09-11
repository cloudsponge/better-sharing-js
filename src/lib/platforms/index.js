import currentPlatform, { css, html } from './process.env.TARGET_PLATFORM'
import options from '../scriptOptions'

const platforms = {
  currentPlatform,
}

const { archetypes } = platforms.currentPlatform

const initArchetype = (props) => {
  props.element = props.element || document.querySelector(props.selector);

  // don't re-init or continue if no element was found
  if (!props.element || props._initialized) {
    return
  }

  // applies the relevant styles inline:
  const computedStyles = window.getComputedStyle(props.element)
  const newStyles = `
    height:   ${computedStyles.height};
    padding:  ${computedStyles.padding};
    margin:   ${computedStyles.margin};
    border:   ${computedStyles.border};
    border-radius: ${computedStyles.borderRadius};
    color:    ${computedStyles.color};
    background-color: ${computedStyles.backgroundColor};
    font:     ${computedStyles.font};
    --margin-left: ${computedStyles.marginLeft};
    --width: ${computedStyles.width};
    --height: ${computedStyles.height};
  `

  props.styles = newStyles;

  // finished init!
  props._initialized = true;
}


// guess the button and other styles from elements that may exist on the page
const guessOptionsFromPage = () => {
  // look for a copy-paste link to grab the colors off of:
  initArchetype(archetypes.buttonArchetype)
  initArchetype(archetypes.mailtoArchetype)
  initArchetype(archetypes.inputArchetype)

  // parse out the mailto params for subject/body/to/from/cc/bcc, etc
  var mailtoParamsArray = archetypes.mailtoArchetype.element.href.split(/[?&=]/).slice(1)
  options().mailtoParams = {}
  for (var i = 0; i < mailtoParamsArray.length; i += 2) {
    options().mailtoParams[mailtoParamsArray[i]] = decodeURIComponent(mailtoParamsArray[i+1])
  }
}

export {
  html,
  guessOptionsFromPage,
}

export default platforms
