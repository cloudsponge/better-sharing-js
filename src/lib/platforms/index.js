import { objToCss } from '../window'

import currentPlatform from './process.env.TARGET_PLATFORM'

const platforms = {
  currentPlatform,
}

export const initArchetype = (props) => {
  props.element = props.element || document.querySelector(props.selector);

  // don't re-init or continue if no element was found
  if (!props.element || props._initialized) {
    return
  }

  // copy the classnames, excluding the current selector's
  // if (props.selector.startsWith('.')) {
  //   var excludedClassName = props.selector.replace(/^\./, '');
  //   props.classes = props.element.className.split(excludedClassName).join('').trim();
  // } else {
  //   props.classes = props.element.className;
  // }

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

  props.styles = objToCss(props.styles) + newStyles;

  // finished init!
  props._initialized = true;
}

export default platforms
