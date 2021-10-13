// import the address-book-connector object from the package
import addressBookConnector from '../../lib/addressBookConnector'
import options, { defaults } from '../../lib/scriptOptions'
import emailFormTemplate from './view/emailFormTemplate.html'
import emailFormCss from './view/emailForm.scss'

defaults({
  contactPickerButton: {
    label: 'Add from Contacts',
  },
  toField: {
    name: 'to',
    placeholder: 'To: (enter your friend&#39;s email)',
    hint: 'Separate multiple emails with commas.',
  },
  messageField: {
    name: 'customMessage',
    default: '',
    placeholder:
      'Message: (enter a message here from you to your friends. ' +
      'We&#39;ll include it at the top of the email that we send them with your referral link)',
  },
  subject: {
    name: 'subject',
    default: 'default subj',
  },
  referralLink: window.location,
  send: {
    label: 'Send the Invitation',
  },
  selector: '.better-sharing-inline-email-form',
})

const betterSharing = (element = null, opts = {}) => {
  // apply the options
  const renderOpts = Object.assign({css: emailFormCss}, options(), opts)

  // attempt to find the default element
  if (!element) {
    element = document.querySelector(options().selector)
  }

  // do something if there is an element passed in
  if (element) {
    element.innerHTML = emailFormTemplate(renderOpts)
  }
}

// allow the options to be assigned this way
betterSharing.options = options

// everything is set up, attempt to attach to the selector
betterSharing()

export default betterSharing
