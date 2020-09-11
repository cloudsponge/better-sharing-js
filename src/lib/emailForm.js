// import the address-book-connector object from the package
import addressBookConnector from '@cloudsponge/address-book-connector.js';
import { addLoadHandler, findAncestor, objToCss } from './window'
import platforms, { initArchetype } from './platforms'
import options, { defaults, afterUpdateOptions } from './scriptOptions'

const { archetypes } = platforms.currentPlatform

// set some reasonable default options here
defaults({
  holder: {
    selector: ".better-sharing-inline-email-form",
    element: null,
    classes: '',
    styles: {
      "margin-top": "15px",
      "margin-bottom": "15px",
    }
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

function css() {
  return `<style>
    ${options().holder.selector} .better-sharing-email-form .better-sharing-contact-button,
    ${options().holder.selector} .better-sharing-email-form .better-sharing-send-button {
      ${archetypes.buttonArchetype.styles}
    }
    ${options().holder.selector} .better-sharing-email-form better-sharing-input-group-contact-button {
      /* vertical-align: top; */
    }
    ${options().holder.selector} .better-sharing-email-form .better-sharing-contact-button {
      /*width: calc(var(--width) - var(--margin-left));*/
    }
    ${options().holder.selector} .better-sharing-email-form better-sharing-input-group-send-button {
      /* text-align: left; */
      /* vertical-align: bottom; */
    }
    ${options().holder.selector} .better-sharing-email-form .better-sharing-send-button {
      margin-left: 0;
    }
    ${options().holder.selector} .better-sharing-email-form .better-sharing-input {
      ${archetypes.inputArchetype.styles}
    }
    ${options().holder.selector} .better-sharing-email-form textarea.better-sharing-input {
      height: calc(var(--height) * 2);
    }
    ${options().holder.selector} .better-sharing-email-form .better-sharing-icon {
      ${objToCss(archetypes.iconArchetype.styles)}
    }
    ${options().holder.selector} .better-sharing-email-form .input-group {
      margin-top: 5px;
      width: 100%;
    }
  </style>`
}

function emailFormHtml() {
  return css() +
  '<div class="better-sharing-email-form">'+
    '<div id="status-message"></div>' +
    '<form action="#" accept-charset="UTF-8" method="post" data-addressBookConnector-js="true">'+

      '<input type="hidden" name="owner" id="owner" value=""/>'+
      '<input type="hidden" name="subject" value="'+options().mailtoParams.subject+'"/>'+

      '<div class="col-md-12">'+
        '<div class="input-group">'+
          '<input type="text" name="email" class="form-control cloudsponge-contacts better-sharing-input" placeholder="To: (enter contact&rsquo;s email)" required="required" aria-describedby="#emailHelp" />'+
          // '<small class="form-text text-muted" id="emailHelp">Separate multiple emails with commas.</small>'+
          '<div class="input-group-btn better-sharing-input-group-contact-button">'+
            '<button class="cloudsponge-launch btn better-sharing-contact-button">'+
              '<i class="fa fa-address-card better-sharing-icon"></i> Add From Contacts'+
            '</button>'+
          '</div>'+
        '</div>'+
      '</div>'+

      '<div class="col-md-12">'+
        '<div class="input-group">'+
          '<textarea name="body" class="better-sharing-input form-control" rows="5">'+options().mailtoParams.body+'</textarea>'+
        '</div>'+
      '</div>'+
      '<div class="col-md-12">'+
        '<div class="input-group">'+
          '<div class="input-group-btn better-sharing-input-group-send-button">'+
            '<button class="btn better-sharing-send-button" id="better-sharing-send-invites" name="button" type="submit">'+
              '<i class="fa fa-paper-plane better-sharing-icon"></i> Send The Invite'+
            '</button>'+
          '</div>'+
        '</div>'+
      '</div>'+

    '</form>'+
  '</div>'
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
  options().holder.element.classList.add('row')
  options().holder.element.classList.add(options().holder.selector.replace(/^\./, ''))

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
