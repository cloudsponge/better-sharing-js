// describes the default values for our platforms

// the idea here is to inherit certain styles from elements that are present on the page already.
// by default, our form will fill the width of the page.
// inherited properties are:
// input: font-size, colors, padding, margins

export const css = () => {
  return `<style>
    ${holder.selector} {
      margin-top: 15px;
      margin-bottom: 15px;
    }
    ${holder.selector} .better-sharing-email-form .better-sharing-contact-button,
    ${holder.selector} .better-sharing-email-form .better-sharing-send-button {
      ${archetypes.buttonArchetype.styles}
    }
    ${holder.selector} .better-sharing-email-form better-sharing-input-group-contact-button {
      /* vertical-align: top; */
    }
    ${holder.selector} .better-sharing-email-form .better-sharing-contact-button {
      /*width: calc(var(--width) - var(--margin-left));*/
    }
    ${holder.selector} .better-sharing-email-form better-sharing-input-group-send-button {
      /* text-align: left; */
      /* vertical-align: bottom; */
    }
    ${holder.selector} .better-sharing-email-form .better-sharing-send-button {
      margin-left: 0;
    }
    ${holder.selector} .better-sharing-email-form .better-sharing-input {
      ${archetypes.inputArchetype.styles}
    }
    ${holder.selector} .better-sharing-email-form textarea.better-sharing-input {
      height: calc(var(--height) * 2);
    }
    ${holder.selector} .better-sharing-email-form .better-sharing-icon {
      ${archetypes.iconArchetype.styles}
    }
    ${holder.selector} .better-sharing-email-form .input-group {
      margin-top: 5px;
      width: 100%;
    }
  </style>`
}

export const html = (mailtoParams={}) => {
  return css() +
  '<div class="better-sharing-email-form">'+
    '<div id="status-message"></div>' +
    '<form action="#" accept-charset="UTF-8" method="post" data-addressBookConnector-js="true">'+

      '<input type="hidden" name="owner" id="owner" value=""/>'+
      `<input type="hidden" name="subject" value="${mailtoParams.subject}"/>`+

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
          `<textarea name="body" class="better-sharing-input form-control" rows="5">${mailtoParams.body}</textarea>`+
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

export const holder = {
  selector: ".better-sharing-inline-email-form",
  classes: ["row", "better-sharing-inline-email-form"],
  ancestorSelector: '.row',
}

export const archetypes = {
  buttonArchetype: {
    selector: "button.kol-copy-and-paste-icon",
    element: null,
    classes: '',
    styles: '',
  },

  iconArchetype: {
    styles: {
      display: 'inline-block',
    },
  },

  inputArchetype: {
    selector: "input.kol-copy-and-paste-sharelink",
    element: null,
    classes: '',
    styles: '',
  },

  mailtoArchetype: {
    selector: "a[href*=mailto]",
    element: null,
    classes: '',
    styles: '',
  },
}

const kickoffLabs = {
  holder,
  archetypes,
}

export default kickoffLabs
