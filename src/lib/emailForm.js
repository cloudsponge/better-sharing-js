// import the address-book-connector object from the package
import addressBookConnector from '@cloudsponge/address-book-connector.js';
import { addLoadHandler, findAncestor } from './window'
import platforms, { guessOptionsFromPage, html } from './platforms'
import options, { defaults, afterUpdateOptions } from './scriptOptions'

const { archetypes } = platforms.currentPlatform

// set some reasonable default options here
defaults({
  holder: {
    selector: ".better-sharing-inline-email-form",
    element: null,
  },
  cloudsponge: {
    sources: ['gmail', 'yahoo', 'windowslive', 'aol', 'icloud', 'office365', 'outlook', 'addressbook', 'csv'],
  },
})

// create the form and add it to the page
function addEmailFormToPage() {
  guessOptionsFromPage();

  var holderElement = document.querySelector(options().holder.selector) || document.createElement('div');
  options().holder.element = holderElement
  options().holder.element.classList.add('row')
  options().holder.element.classList.add(options().holder.selector.replace(/^\./, ''))

  var mailtoEl = archetypes.mailtoArchetype.element
  var parentClass = findAncestor(mailtoEl, '.row');

  holderElement.innerHTML = html(options().mailtoParams);
  parentClass.insertAdjacentElement('afterend', holderElement);

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
