// here's a structured datum that identifies the DOM elements which are to be added to the 
//  page to support the email form.

const domMap = {
  holder: {
    selector: '.bettersharing-inline-email-form',
    children: {
      alert: {selector: '.bettersharing-email-alert'},
      form: {
        selector: '.bettersharing-email-form',
        children: {
          layoutDivRecipient: {
            selector: '.bettersharing-email-recipient-div',
            children: {
              formGroupRecipient: {
                selector: '.bettersharing-email-recipient-form-group',
                children: {
                  recipientInput: {selector: '.bettersharing-email-recipient-input'},
                  contactPickerGroupButton: {
                    selector: '.bettersharing-email-contact-picker-group-button',
                    children: {
                      contactPickerButton: {
                        selector: '.bettersharing-email-contact-picker-button',
                        children: {
                          contactPickerButtonIcon: {
                            selector: '.bettersharing-email-contact-picker-button-icon',
                          },
                          contactPickerButtonLabel: {
                            selector: '.bettersharing-email-contact-picker-button-label',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          layoutDivBody: {
            selector: '.bettersharing-email-body-div',
            children: {
              formGroupBody: {
                selector: '.bettersharing-email-body-form-group',
                children: {
                  bodyInput: {selector: '.bettersharing-email-body-input'},
                  sendGroupButton: {
                    selector: '.bettersharing-email-send-group-button',
                    children: {
                      sendButton: {
                        selector: '.bettersharing-email-send-button',
                        children: {
                          sendButtonIcon: {
                            selector: '.bettersharing-email-send-button-icon',
                          },
                          sendButtonLabel: {
                            selector: '.bettersharing-email-send-button-label',
                          },
                        },
                      },
                    }
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

export default domMap
