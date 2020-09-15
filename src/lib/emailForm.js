// import the address-book-connector object from the package
import addressBookConnector from '@cloudsponge/address-book-connector.js';
import { addLoadHandler, findAncestor } from './window'
import platforms, { guessOptionsFromPage, html } from './platforms'
import options, { defaults, afterUpdateOptions } from './scriptOptions'

const { holder, archetypes } = platforms.currentPlatform

// set some reasonable default options here
defaults({
  cloudsponge: {
    sources: ['gmail', 'yahoo', 'windowslive', 'aol', 'icloud', 'office365', 'outlook', 'addressbook', 'csv'],
  },
})

// create the form and add it to the page
function addEmailFormToPage() {
  guessOptionsFromPage();

  let holderElement = document.querySelector(holder.selector)

  // if we didn't find the holder, then we need to create one and append it
  //  at an assumed location
  if (!holderElement) {
    holderElement = document.createElement('div')
    // holderElement.classList.add(options().holder.selector.replace(/^\./, ''))
    // this is a new element so we need to add it to the page
    const parentClass = findAncestor(archetypes.mailtoArchetype.element, holder.ancestorSelector)
    parentClass.insertAdjacentElement('afterend', holderElement)
  }

  // kickoff labs reqires the row class to be added
  holderElement.classList.add(...holder.classes)

  // finally, populate the holder with our custom html
  holderElement.innerHTML = html(options().mailtoParams)

  // now it's time to configure the address-book-connector script
  initAddressBookConnector(options())
}

const initAddressBookConnector = (opts) => {
  addressBookConnector.setOptions({
    key: opts.key || opts.cloudspongeKey || opts.betterSharingKey,
    success: function() {
      // console.log('success!');
      var contacts = $('[data-addressBookConnector-js] .cloudsponge-contacts');
      document.getElementById('status-message').innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">We sent an email to '+contacts.val()+'.</div>';
      // clear the contacts field
      contacts.val('');
    },
    failure: function(data) {
      console.log('success NOT!', data);
      document.getElementById('status-message').innerHTML('<div class="alert alert-warning alert-dismissible fade show" role="alert">We failed to send any email: '+data.responseText+'.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
    },
    cloudspongeOptions: {
      ...opts.cloudsponge,
    },
  })
}

afterUpdateOptions(initAddressBookConnector)

const run = () => {
  addLoadHandler(addEmailFormToPage)
}

const emailForm = { run, options }
export default emailForm
