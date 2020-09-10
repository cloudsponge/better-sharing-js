// describes the default values for our platforms

const kickoffLabs = {
  archetypes: {
    buttonArchetype: {
      selector: ".kol-copy-and-paste-icon",
      element: null,
      classes: '',
      styles: {
        width: '200px',
        "vertical-align": "top",
        "margin-left": '5px',
      },
    },

    inputArchetype: {
      selector: "input.kol-copy-and-paste-sharelink",
      element: null,
      classes: '',
      styles: '',
    },

    formGroupArchetype: {
      selector: '[data-kol-editor=copy-and-paste] > .input-group',
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

    divLayoutArchetype: {
      selector: '[data-kol-editor="copy-and-paste"]',
      element: null,
      classes: '',
      styles: {
        "margin-bottom": "5px",
      },
    },
  },
}


export default kickoffLabs
