import template from './kickoff-labs.html'

// describes the default values for our platforms
import { holder, archetypes } from './kickoff-labs.json'

const html = (options = {}) => {
  return template({
    holder,
    archetypes,
    options,
  })
}

export { html, holder, archetypes }

const kickoffLabs = {
  html,
  holder,
  archetypes,
}

export default kickoffLabs
