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
import modalEmailFormTemplate from './view/modalEmailFormTemplate.html'
import emailFormCss from './view/emailForm.scss'
import { parseQuery, hijackFn } from '../../lib/utils'

defaults({
  contactPickerButton: {
    label: 'Add from Contacts',
    title: 'Invite people directly from your address book.',
  },
  // suppresses the email form fields
  // displayEmailForm: false,
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
  modal: {
    title: 'Share via Email',
  },
})

const closeModal = () => {
  document.getElementById('better-sharing-modal').style.display = 'none'
}
const openModal = () => {
  document.getElementById('better-sharing-modal').style.display = 'block'
}

const betterSharing = (opts = {}) => {
  // apply the options
  opts = Object.assign({ css: emailFormCss }, options(opts))

  // did they pass in an element to populate?
  let element = opts.element

  // attempt to find the default element
  if (!element) {
    element = document.querySelector(opts.selector)
  }

  // if the selected element happens to be a mailto: pull the options from it
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
        opts.subject.default = mailtoParams.subject
      }
      if (mailtoParams.body) {
        opts.body = mailtoParams.body
      }
      options(opts)
    }
  }

  // this option removes the email for and triggers the form action from the Contact Picker
  if (!opts.view || opts.view == 'false') {
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

  // TODO: remove the 'mailto' option, it is overridden by the sendVia="mailto" option
  if (opts.mailto) {
    if (element) {
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

  // do something if there is an element passed in
  if (opts.view == 'modal') {
    // add the modal to the page
    document.body.insertAdjacentHTML('beforeend', modalEmailFormTemplate(opts))
    // selected element launches the modal
    if (element) {
      // remove the onclick attribute if it's defined
      if (element.onclick) {
        element.onclick = null
        element.setAttribute('onclick', null)
      }
      element.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        // launch the modal!
        openModal()
        if (opts.sendVia == 'mailto') {
          options({ afterSuccess: closeModal })
        } else {
          // we're not closing the modal, so dismiss the alert automatically
          options({ autoClear: true })
        }
      })
      // click the modal x or outside the modal closes the modal:
      document
        .getElementsByClassName('better-sharing-modal-close')
        .forEach((closeButton) => {
          closeButton.addEventListener('click', closeModal)
        })
    }
  } else if (element) {
    // get the appropriate html template
    const template =
      !opts.view || opts.view == 'false'
        ? buttonOnlyTemplate
        : opts.contactPickerButton.deepLinks
        ? emailFormTemplateDeep
        : emailFormTemplate

    element.innerHTML = template(opts)
  }
  // initialize the addressBookConnectoer after we added the HTML on the page
  addressBookConnector.initialize()
  // if (options().bindEvent)
  const formButton = document.querySelector('.better-sharing-email-form button.better-sharing-button.better-sharing-send-button')
  if (formButton) {
    formButton.addEventListener('click', addressBookConnector.submitForm)
  }
}

// allow the options to be assigned this way
betterSharing.options = options

if (!options().delayInit) {
  // everything is set up, attempt to attach to the selector
  betterSharing()
}

export default betterSharing
