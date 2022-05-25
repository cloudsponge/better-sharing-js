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

// code to look through global vars to find or build the referralLink
const referralLinkParser = () => {
  if (window.kol_lead && kol_lead.social_url) {
    return window.kol_lead.social_url
  }
  if (window.kol_signup_url) {
    if (window.kol_lead && kol_lead.id) {
      return kol_signup_url + '?kid=' + kol_lead.id
    }
    if (
      window.__kol_analytics &&
      __kol_analytics.user &&
      __kol_analytics.user.cid
    ) {
      return kol_signup_url + '?kid=' + __kol_analytics.user.cid
    }
  }
  return null
}

const emailShareSubject = () => {
  return (
    (window.kol_default_list_options &&
      kol_default_list_options.email_share_subject) ||
    ''
  )
}

const emailShareBody = () => {
  return (
    (window.kol_default_list_options &&
      kol_default_list_options.email_share_body) ||
    ''
  )
}

export {
  html,
  holder,
  archetypes,
  referralLinkValidator,
  referralLinkParser,
  emailShareSubject,
  emailShareBody,
}

const kickoffLabs = {
  html,
  holder,
  archetypes,
  referralLinkValidator,
  referralLinkParser,
  emailShareSubject,
  emailShareBody,
}

export default kickoffLabs
