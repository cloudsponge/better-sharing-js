// *****************************************************
//  addressBookConnector.js import here
import addressBookConnector from '@cloudsponge/address-book-connector.js'
import options, { defaults, afterUpdateOptions } from './scriptOptions'

// set some reasonable default options here
defaults({
  cloudsponge: {
    sources: [
      'gmail',
      'yahoo',
      'windowslive',
      'aol',
      'icloud',
      'office365',
      'outlook',
      'addressbook',
      'csv',
    ],
  },
})

export const clearAlert = () => {
  const alertElement = document.getElementById('better-sharing-status-message')
  if (alertElement) {
    alertElement.innerHTML = ''
  }
}

export const success = (data) => {
  const contacts =
    document.querySelector(
      '[data-addressBookConnector-js] .cloudsponge-contacts'
    ) || document.createElement('input')

  // alert message only if this action is connected to Zapier
  if (options().sendVia != 'mailto') {
    const emails = contacts.value
    const alertElement = document.getElementById('better-sharing-status-message')
    if (alertElement) {
      alertElement.innerHTML =
        '<div class="better-sharing-alert better-sharing-alert-success">' +
        `We sent an email to ${emails}.` +
        '</div>'
      options().autoClear && setTimeout(clearAlert, 5000)
    }
  }
  // clear the contacts field
  contacts.value = ''
  // clear the message
  const customMessage = document.querySelector('[data-addressBookConnector-js] [name=customMessage]')
  if (customMessage) {
    customMessage.value = ''
  }
  try {
    options().afterSuccess && options().afterSuccess()
  } catch (e) {
    // empty response here
    console.error('Error in afterSuccess callback: ', e)
  }
}

export const failure = (error, data) => {
  console.error('[betterSharing] There was a problem sending the email: ', data)
  const alertElement = document.getElementById('better-sharing-status-message')
  if (alertElement) {
    alertElement.innerHTML =
      '<div class="better-sharing-alert better-sharing-alert-warning">We failed to send any email: ' +
      ((data.xhr && data.xhr.responseText) ||
        'This may have been a duplicate email or another unknown error occurred.') +
      '.</div>'
    options().autoClear && setTimeout(clearAlert, 5000)
  }
}

const emailOpts = (opts) => {
  const emailOptionNames = [
    'subject',
    'body',
    'senderEmail',
    'defaultSenderName',
    'defaultReplyToEmail',
    'defaultReplyToName',
  ]
  let emailOpts = {}
  emailOptionNames.forEach((keyName) => {
    if (opts[keyName]) {
      emailOpts[keyName] = opts[keyName]
    }
  })
  return emailOpts
}

const initAddressBookConnector = (opts) => {
  addressBookConnector.setOptions({
    key: opts.key || opts.cloudspongeKey || opts.betterSharingKey,
    cloudspongeOptions: {
      ...opts.cloudsponge,
    },
    ...emailOpts(opts),
    success,
    failure,
  })
}
afterUpdateOptions(initAddressBookConnector)

export default addressBookConnector
