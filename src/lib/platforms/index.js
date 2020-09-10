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
  if (props.selector.startsWith('.')) {
    var excludedClassName = props.selector.replace(/^\./, '');
    props.classes = props.element.className.split(excludedClassName).join('').trim();
  } else {
    props.classes = props.element.className;
  }

  // copies the styles
  props.styles = objToCss(props.styles) + (props.element.getAttribute('style') || '');

  // finished init!
  props._initialized = true;
}

export default platforms
