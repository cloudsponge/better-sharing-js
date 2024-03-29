// get access to the module from emailForm so we can spyOn some of the functions
import * as emailFormExports from '../../src/lib/emailForm'
const emailForm = emailFormExports.default
const {
  addEmailFormToPage,
  emailOpts,
  initAddressBookConnector,
  success,
  failure,
} = emailFormExports

import options from '../../src/lib/scriptOptions'
import * as utils from '../../src/lib/window'
import * as platforms from '../../src/lib/platforms'
const { archetypes } = platforms
import addressBookConnector from '@cloudsponge/address-book-connector.js'

beforeEach(() => {
  // minimal page definition here:
  document.body.innerHTML =
    '<div class="row"><a href="mailto:someone@example.com"></a></div>'
  // reset the archetypes before each
  Object.keys(archetypes).forEach((key) => {
    delete archetypes[key].element
  })
})

describe('options', () => {
  it('passes the options through', () => {
    expect(emailForm.options).toBe(options)
  })
})

describe('run', () => {
  it('calls addLoadHandler(addEmailFormToPage)', () => {
    const addLoadHandlerSpy = jest.spyOn(utils, 'addLoadHandler')
    emailForm.run()
    expect(addLoadHandlerSpy).toHaveBeenCalled()
  })
})

describe('addEmailFormToPage', () => {
  it('queues itself if guessOptionsFromPage is not ready', () => {
    const guessOptionsFromPageSpy = jest.spyOn(
      platforms,
      'guessOptionsFromPage'
    )
    const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
    guessOptionsFromPageSpy.mockImplementation(() => false)
    addEmailFormToPage()
    expect(setTimeoutSpy).toHaveBeenCalled()
    // call the timeout function:
    setTimeoutSpy.mock.calls[0][0]()
    // the timeout function should execute guessOptionsFromPage and pass in the argument 1
    expect(guessOptionsFromPageSpy.mock.calls.length).toBe(2)
    guessOptionsFromPageSpy.mockRestore()
  })

  it('stops retrying the call after many times', () => {
    const guessOptionsFromPageSpy = jest.spyOn(
      platforms,
      'guessOptionsFromPage'
    )
    guessOptionsFromPageSpy.mockImplementation(() => false)
    const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
    document.body.innerHTML = `<div class="better-sharing"></div>`
    addEmailFormToPage(10)
    expect(setTimeoutSpy).not.toHaveBeenCalled()
    setTimeoutSpy.mockRestore()
    guessOptionsFromPageSpy.mockRestore()
  })

  it('fails gracefully without the holder div', () => {
    document.body.innerHTML = ``
    addEmailFormToPage()
    expect(document.body.innerHTML).not.toMatch(
      /^<div class="better-sharing row">/
    )
  })

  it('finds the holder div', () => {
    document.body.innerHTML = `<div class="better-sharing"></div>
      <div class="row">
        <a href="mailto:someone@example.com"></a>
      </div>`
    addEmailFormToPage()
    expect(document.body.innerHTML).toMatch(/^<div class="better-sharing row">/)
  })

  it('creates the holder div', () => {
    addEmailFormToPage()
    expect(document.body.innerHTML).toMatch('<div class="row better-sharing">')
  })

  it('calls initAddressBookConnector', () => {
    const optionsSpy = jest.spyOn(addressBookConnector, 'setOptions')
    addEmailFormToPage()
    expect(optionsSpy).toHaveBeenCalled()
  })
})

describe('emailOpts', () => {
  it('extracts only the expected key-values', () => {
    const options = {
      subject: 'subject',
      body: 'body',
      senderEmail: 'senderEmail',
      defaultSenderName: 'defaultSenderName',
      defaultReplyToEmail: 'defaultReplyToEmail',
      defaultReplyToName: 'defaultReplyToName',
      otherOptions: {},
    }
    const emailOptions = emailOpts(options)
    expect(Object.keys(emailOptions)).toEqual([
      'subject',
      'body',
      'senderEmail',
      'defaultSenderName',
      'defaultReplyToEmail',
      'defaultReplyToName',
    ])
  })
})

describe('initAddressBookConnector', () => {
  it('sets the addressBookConnector options', () => {
    const optionsSpy = jest.spyOn(addressBookConnector, 'setOptions')
    initAddressBookConnector({})
    expect(optionsSpy).toHaveBeenCalled()
  })
})

describe('success and failure', () => {
  beforeEach(() => {
    addEmailFormToPage()
  })
  it('appends a successful message to the page', () => {
    success()
    expect(document.body.innerHTML).toMatch(
      '<div class="alert alert-success alert-dismissible fade show" role="alert">'
    )
  })
  it('succeeds without a contacts box', () => {
    // hide the contacts input to simulate some strange condition
    const contacts = document.querySelector(
      '[data-addressBookConnector-js] .cloudsponge-contacts'
    )
    contacts.setAttribute('class', '')
    success()
    expect(document.body.innerHTML).toMatch(
      '<div class="alert alert-success alert-dismissible fade show" role="alert">'
    )
  })
  it('appends a failure message to the page', () => {
    // don't clutter the log
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    failure({ xhr: { responseText: 'bad news' } })
    expect(errorSpy).toHaveBeenCalled()
    expect(document.body.innerHTML).toMatch(
      '<div class="alert alert-warning alert-dismissible fade show" role="alert">'
    )
  })
  it('appends a default failure message to the page', () => {
    // don't clutter the log
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    failure({ xhr: { responseText: '' } })
    expect(errorSpy).toHaveBeenCalled()
    expect(document.body.innerHTML).toMatch(
      '<div class="alert alert-warning alert-dismissible fade show" role="alert">'
    )
  })
})
