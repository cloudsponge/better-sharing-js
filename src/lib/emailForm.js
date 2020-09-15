// import the address-book-connector object from the package
import addressBookConnector from '@cloudsponge/address-book-connector.js';
import { addLoadHandler, findAncestor, objToCss } from './window'
import platforms, { initArchetype } from './platforms'
import options, { defaults, afterUpdateOptions } from './scriptOptions'

const { archetypes } = platforms.currentPlatform

// set some reasonable default options here
defaults({
  holder: {
    selector: ".bettersharing-inline-email-form",
    element: null,
    classes: ''
  },
  cloudsponge: {
    sources: ['gmail', 'yahoo', 'windowslive', 'aol', 'icloud', 'office365', 'outlook', 'addressbook', 'csv'],
  },
})

// applies/inherits the classnames and styles from an archetype
function applyProps(element, parentProps) {
  // don't re-init or continue if no element was found
  if (!element) {
    return
  }

  element.classnames = (element.classnames || '') + ' ' + (parentProps.classes || '');
  element.setAttribute('style', objToCss(parentProps.styles) + (element.getAttribute('style') || ''));
}

function emailFormHtml() {
  return '<div id="status-message"></div>' +
    '<form action="#" accept-charset="UTF-8" method="post" data-addressBookConnector-js="true">'+
      '<input type="hidden" name="owner" id="owner" value=""/>'+
      '<input type="hidden" name="subject" id="subject" value="'+options().mailtoParams.subject+'"/>'+

      '<div class="'+archetypes.divLayoutArchetype.classes+'" style="'+archetypes.divLayoutArchetype.styles+'">'+
        '<div class="'+archetypes.formGroupArchetype.classes+'">'+
          '<input type="text" name="email" id="email" value="" class="'+archetypes.inputArchetype.classes+' cloudsponge-contacts" placeholder="To: (enter contact&rsquo;s email)" required="required" aria-describedby="#emailHelp"/>'+
          // '<small class="form-text text-muted" id="emailHelp">Separate multiple emails with commas.</small>'+
          '<div class="input-group-btn" style="vertical-align: top">'+
            '<button class="cloudsponge-launch '+archetypes.buttonArchetype.classes+'" type="button" style="'+archetypes.buttonArchetype.styles+'">'+
              '<i class="fa fa-address-card"></i> Add From Contacts'+
            '</button>'+
          '</div>'+
        '</div>'+
      '</div>'+

      '<div class="'+archetypes.divLayoutArchetype.classes+'" style="'+archetypes.divLayoutArchetype.styles+'">'+
        '<div class="'+archetypes.formGroupArchetype.classes+'">'+
          '<textarea name="body" id="body" class="'+archetypes.inputArchetype.classes+'" rows="5">'+options().mailtoParams.body+'</textarea>'+

          '<div class="input-group-btn" style="vertical-align: bottom">'+
            '<button class="'+archetypes.buttonArchetype.classes+'" id="send-invites" name="button" type="submit" style="'+archetypes.buttonArchetype.styles+'">'+
            // '<button class="btn btn-primary has-set-radius" style="margin-left: 5px; vertical-align: bottom; width: 200px">'+
              '<i class="fa fa-paper-plane"></i> Send The Invite'+
            '</button>'+
          '</div>'+

        '</div>'+
      '</div>'+
    '</form>'
}

// guess the button and other styles from elements that may exist on the page
function guessOptionsFromPage() {
  // look for a copy-paste link to grab the colors off of:
  initArchetype(archetypes.buttonArchetype)
  initArchetype(archetypes.mailtoArchetype)
  initArchetype(archetypes.divLayoutArchetype)
  initArchetype(archetypes.inputArchetype)
  initArchetype(archetypes.formGroupArchetype)

  options().holder.element = document.querySelector(options().holder.selector) || document.createElement('div');
  applyProps(options().holder.element, options().holder)

  // parse out the mailto params for subject/body/to/from/cc/bcc, etc
  var mailtoParamsArray = archetypes.mailtoArchetype.element.href.split(/[?&=]/).slice(1)
  options().mailtoParams = {}
  for (var i = 0; i < mailtoParamsArray.length; i += 2) {
    options().mailtoParams[mailtoParamsArray[i]] = decodeURIComponent(mailtoParamsArray[i+1])
  }
}

// create the form and add it to the page
function addEmailFormToPage() {
  guessOptionsFromPage();

  var mailtoEl = archetypes.mailtoArchetype.element
  var parentClass = findAncestor(mailtoEl, '.row');

  var holderElement = options().holder.element

  // holderElement.setAttribute('class', parentClass.getAttribute('class'))
  // holderElement.setAttribute('style', parentClass.getAttribute('style'))
  // if (options.holderStyles) {
  //   var style = objToCss(options.holderStyles);
  //   holderElement.setAttribute('style', parentClass.getAttribute('style') + ';' + style);
  // }

  holderElement.innerHTML = emailFormHtml();
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
