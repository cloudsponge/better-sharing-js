// import the address-book-connector object from the package
import addressBookConnector, { success, failure } from '../../lib/addressBookConnector'
import options, { defaults } from '../../lib/scriptOptions'
import buttonOnlyTemplate from './view/buttonOnlyTemplate.html'
import emailFormTemplate from './view/emailFormTemplate.html'
import emailFormTemplateDeep from './view/emailFormTemplateDeep.html'
import emailFormCss from './view/emailForm.scss'

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
  selector: '.better-sharing-inline-email-form',
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
    options({
      cloudsponge: {
        afterSubmitContacts: function(contacts, _, owner) {
          const data = {
            owner,
            contacts,
          }
          window.cloudsponge.trigger(data)
            .then(() => {
              console.log(
                '[betterSharing.js] Successfully triggered cloudsponge with data:',
                data
              );
              success(`${contacts.length} contacts were successfully shared.`)
              // invoke a callback on the addressBookConnector object
              options.success && options.success();
            })
            .catch(error => {
              console.error(
                '[betterSharing.js] Failed to trigger cloudsponge:',
                error
              );
              failure(error, "Something went wrong while attempting to share your address book")
              // invoke a callback on the addressBookConnector object
              options.failure && options.failure(error);
            });
        }
      }
    })
  }

  const template = !opts.displayEmailForm
    ? buttonOnlyTemplate
    : opts.contactPickerButton.deepLinks
    ? emailFormTemplateDeep
    : emailFormTemplate
  // do something if there is an element passed in
  if (element) {
    element.innerHTML = template(opts)
  }
}

// allow the options to be assigned this way
betterSharing.options = options

// everything is set up, attempt to attach to the selector
betterSharing()

export default betterSharing
