// import the address-book-connector object from the package
import addressBookConnector, {
  success,
  failure,
} from '../../lib/addressBookConnector'
import options, { defaults } from '../../lib/scriptOptions'
import templateMailto from './view/templateMailto.html'
import buttonOnlyTemplate from './view/buttonOnlyTemplate.html'
import emailFormTemplate from './view/emailFormTemplate.html'
import emailFormTemplateDeep from './view/emailFormTemplateDeep.html'
import emailFormCss from './view/emailForm.scss'
import { parseQuery, hijackFn } from '../../lib/utils'

defaults({
  contactPickerButton: {
    label: 'Add from Contacts',
    title: 'Invite people directly from your address book.',
  },
  // suppresses the email form fields
  displayEmailForm: false,
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
  sendButton: {
    label: 'Send the Invitation',
  },
  referralLink: window.location,
  selector: '.better-sharing',
  // mailto: true | 'delay' | 'delayNoMailto',
})

const betterSharing = (opts = {}) => {
  // apply the options
  opts = Object.assign({ css: emailFormCss }, options(opts))

  // did they pass in an element to populate?
  let element = opts.element

  // attempt to find the default element
  if (!element) {
    element = document.querySelector(opts.selector)
  }

  if (!opts.displayEmailForm) {
    // trigger automatically at the end of the contact selection
    addressBookConnector.setOptions({
      onUpdateContacts: () => {
        const form = document.querySelector(
          '.better-sharing-default > form[data-addressBookConnector-js]'
        )
        form && form.dispatchEvent(new Event('submit'))
      },
    })
  }

  if (opts.mailto) {
    if (element) {
      const href =
        (element.href && element.href.startsWith('mailto:') && element.href) ||
        (element.dataset.href &&
          element.dataset.href.startsWith('mailto:') &&
          element.dataset.href)
      if (href) {
        // infer the message and subject fields from the mailto destination
        const mailtoParams = parseQuery(href)
        if (mailtoParams.subject) {
          opts.subject = mailtoParams.subject
        }
        if (mailtoParams.body) {
          opts.body = mailtoParams.body
        }
        opts.autoClear = true
        options(opts)
      }
      element.insertAdjacentHTML('afterend', templateMailto(opts))

      element.addEventListener('click', (e) => {
        if (e._executingDelay) {
          return
        }
        if (window.cloudsponge) {
          // we always don't launch the link
          e.preventDefault()
          // optionally we stop the propagation if there's another thing happening
          if (opts.mailto.toString().startsWith('delay')) {
            e.stopPropagation()
            options({
              afterSuccess: () => {
                const completeClick = () => {
                  e._executingDelay = true
                  element.dispatchEvent(e)
                }
                // hack to make it so that the call to window.open fails
                opts.mailto == 'delayNoMailto'
                  ? hijackFn(window, 'open', completeClick)
                  : completeClick()
              },
            })
          }

          // contact picker is GO
          cloudsponge.launch()
        }
      })
    }
    return
  }

  const template = !opts.displayEmailForm
    ? buttonOnlyTemplate
    : opts.contactPickerButton.deepLinks
    ? emailFormTemplateDeep
    : emailFormTemplate
  // do something if there is an element passed in
  if (element) {
    element.innerHTML = template(opts)
    // initialize the addressBookConnectoer after we add the HTML on the page
    addressBookConnector.initialize()
  }
}

// allow the options to be assigned this way
betterSharing.options = options

// everything is set up, attempt to attach to the selector
betterSharing()

export default betterSharing
