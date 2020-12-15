// import the address-book-connector object from the package
import addressBookConnector from '@cloudsponge/address-book-connector.js'
import { addLoadHandler, findAncestor } from './window'
import { holder, archetypes, guessOptionsFromPage, html } from './platforms'
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

// create the form and add it to the page
export const addEmailFormToPage = (tries = 0) => {
  if (!guessOptionsFromPage() && tries < 10) {
    setTimeout(() => addEmailFormToPage(tries + 1), 500)
    return
  }

  let holderElement = document.querySelector(holder.selector)
  // if we didn't find the holder, then we need to create one and append it
  //  at an assumed location
  if (!holderElement) {
    holderElement = document.createElement('div')
    // holderElement.classList.add(options().holder.selector.replace(/^\./, ''))
    // this is a new element so we need to add it to the page
    const parentClass = findAncestor(
      archetypes.mailtoArchetype.element,
      holder.ancestorSelector
    )
    parentClass.insertAdjacentElement('afterend', holderElement)
  }

  // kickoff labs reqires the row class to be added
  holderElement.classList.add(...holder.classes)

  // finally, populate the holder with our custom html
  holderElement.innerHTML = html(options())

  // now it's time to configure the address-book-connector script
  initAddressBookConnector(options())
}

export const success = () => {
  const contacts =
    document.querySelector(
      '[data-addressBookConnector-js] .cloudsponge-contacts'
    ) || document.createElement('input')
  const emails = contacts.value
  document.getElementById('status-message').innerHTML =
    '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
    `We sent an email to ${emails}.</div>`
  // clear the contacts field
  contacts.value = ''
}

export const failure = (data) => {
  console.error('[betterSharing] There was a problem sending the email: ', data)
  document.getElementById('status-message').innerHTML =
    '<div class="alert alert-warning alert-dismissible fade show" role="alert">We failed to send any email: ' +
    (data.xhr.responseText ||
      'This may have been a duplicate email or another unknown error occurred.') +
    '.<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span></button></div>'
}

export const emailOpts = (opts) => {
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

export const initAddressBookConnector = (opts) => {
  addressBookConnector.setOptions({
    key: opts.key || opts.cloudspongeKey || opts.betterSharingKey,
    ...emailOpts(opts),
    // subject: opts.subject,
    // body: opts.body,
    // senderEmail: opts.senderEmail,
    // defaultSenderName: opts.defaultSenderName,
    // defaultReplyToEmail: opts.defaultReplyToEmail,
    // defaultReplyToName: opts.defaultReplyToName,
    cloudspongeOptions: {
      ...opts.cloudsponge,
    },
    success,
    failure,
  })
}

afterUpdateOptions(initAddressBookConnector)

const run = () => {
  addLoadHandler(addEmailFormToPage)
}

const emailForm = { run, options }
export default emailForm
