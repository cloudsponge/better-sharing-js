import options from '../scriptOptions'
// loads the target platform using require so that we can run the tests as well as
// use replacement for the build process.
const currentPlatform = require(`./${process.env.TARGET_PLATFORM}`)
const { holder, archetypes, html } = currentPlatform

const initArchetype = (props) => {
  props.element = props.element || document.querySelector(props.selector)

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

  props.styles = newStyles

  // finished init!
  props._initialized = true
}

// guess the button and other styles from elements that may exist on the page
const guessOptionsFromPage = () => {
  // look for a copy-paste link to grab the colors off of:
  initArchetype(archetypes.buttonArchetype)
  initArchetype(archetypes.mailtoArchetype)
  initArchetype(archetypes.inputArchetype)

  options().referralLink =
    (archetypes.inputArchetype.element &&
      archetypes.inputArchetype.element.value) ||
    ''
  options().body ||= ''
  options().subject ||= ''

  // parse out the mailto params for subject/body/to/from/cc/bcc, etc
  if (archetypes.mailtoArchetype.element) {
    const mailtoParamsArray = archetypes.mailtoArchetype.element.href
      .split(/[?&=]/)
      .slice(1)
    for (let i = 0; i < mailtoParamsArray.length; i += 2) {
      options()[mailtoParamsArray[i]] ||= decodeURIComponent(
        mailtoParamsArray[i + 1]
      )
    }
  }
}

export { holder, archetypes, html, initArchetype, guessOptionsFromPage }

export default currentPlatform
