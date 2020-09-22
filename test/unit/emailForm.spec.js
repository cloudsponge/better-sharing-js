// get access to the module from emailForm so we can spyOn some of the functions
import * as emailFormExports from '../../src/lib/emailForm'
const emailForm = emailFormExports.default
const { addEmailFormToPage, initAddressBookConnector, success, failure } = emailFormExports

import options from '../../src/lib/scriptOptions'
import * as utils from '../../src/lib/window'
import { guessOptionsFromPage, archetypes } from '../../src/lib/platforms'
import addressBookConnector from '@cloudsponge/address-book-connector.js'

beforeEach(() => {
  // minimal page definition here:
  document.body.innerHTML = '<div class="row"><a href="mailto:someone@example.com"></a></div>'
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
  // it('calls guessOptionsFromPage', () => {
  //   document.body.innerHTML = '<div class="row"><a href="mailto:someone@example.com"></a></div>'
  //   addEmailFormToPage()
  //   expect(guessOptionsFromPage).toHaveBeenCalled()
  // })
  it('finds the holder div', () => {
    document.body.innerHTML = '<div class="better-sharing-inline-email-form"></div><div class="row"><a href="mailto:someone@example.com"></a></div>'
    addEmailFormToPage()
    expect(document.body.innerHTML).toMatch(/^<div class="better-sharing-inline-email-form row">/)
  })
  it('creates the holder div', () => {
    addEmailFormToPage()
    expect(document.body.innerHTML).toMatch('<div class="row better-sharing-inline-email-form">')
  })
  // it('updates the classes on the holder')
  // it('assigns the html for the form to the holder', () => {
  //
  // })
  it('calls initAddressBookConnector', () => {
    const optionsSpy = jest.spyOn(addressBookConnector, 'setOptions')
    // const initAddressBookConnectorSpy = jest.spyOn(emailFormExports, 'initAddressBookConnector')
    addEmailFormToPage()
    expect(optionsSpy).toHaveBeenCalled()
    // expect(initAddressBookConnectorSpy).toHaveBeenCalled()
  })
})

describe('initAddressBookConnector', () => {
  it('sets the addressBookConnector options', () => {
    const optionsSpy = jest.spyOn(addressBookConnector, 'setOptions')
    initAddressBookConnector({})
    expect(optionsSpy).toHaveBeenCalled()
  })
  // it('passes through the cloudsponge options')
})


describe('success and failure', () => {
  beforeEach(() => {
    addEmailFormToPage()
  })
  it('appends a successful message to the page', () => {
    success()
    expect(document.body.innerHTML).toMatch('<div class="alert alert-success alert-dismissible fade show" role="alert">')
  })
  it('succeeds without a contacts box', () => {
    // hide the contacts input to simulate some strange condition
    const contacts = document.querySelector('[data-addressBookConnector-js] .cloudsponge-contacts')
    contacts.setAttribute('class', '')
    success()
    expect(document.body.innerHTML).toMatch('<div class="alert alert-success alert-dismissible fade show" role="alert">')
  })
  it('appends a failure message to the page', () => {
    // don't clutter the log
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    failure({responseText: 'bad news'})
    expect(errorSpy).toHaveBeenCalled()
    expect(document.body.innerHTML).toMatch('<div class="alert alert-warning alert-dismissible fade show" role="alert">')
  })
})
// describe('init', () => {
//   it('calls afterUpdateOptions(initAddressBookConnector)', () => {
//
//   })
// })
//
