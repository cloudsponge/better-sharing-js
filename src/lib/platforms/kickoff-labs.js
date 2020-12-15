import template from './kickoff-labs.html'

// describes the default values for our platforms
import { holder, archetypes, referralLinkValidator } from './kickoff-labs.json'

const html = (options = {}) => {
  return template({
    holder,
    archetypes,
    options,
  })
}

export { html, holder, archetypes, referralLinkValidator }

const kickoffLabs = {
  html,
  holder,
  archetypes,
  referralLinkValidator,
}

export default kickoffLabs
