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

export const success = (successMessage) => {
  const contacts =
    document.querySelector(
      '[data-addressBookConnector-js] .cloudsponge-contacts'
    ) || document.createElement('input')
  const emails = contacts.value
  const alertElement = document.getElementById('better-sharing-status-message')
  if (alertElement) {
    alertElement.innerHTML =
      '<div class="better-sharing-alert better-sharing-alert-success">' +
      (successMessage || `We sent an email to ${emails}.`) +
      '</div>'
  }
  // clear the contacts field
  contacts.value = ''
}

export const failure = (data, message) => {
  console.error('[betterSharing] There was a problem sending the email: ', data)
  const alertElement = document.getElementById('better-sharing-status-message')
  if (alertElement) {
    alertElement.innerHTML =
      `<div class="better-sharing-alert better-sharing-alert-warning">${message || "We failed to send any email"}: ` +
      (data.xhr && data.xhr.responseText ||
        'This may have been a duplicate email or another unknown error occurred.') +
      '.</div>'
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
