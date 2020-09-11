// describes the default values for our platforms

// the idea here is to inherit certain styles from elements that are present on the page already.
// by default, our form will fill the width of the page.
// inherited properties are:
// input: font-size, colors, padding, margins

const kickoffLabs = {
  archetypes: {
    buttonArchetype: {
      selector: "button.kol-copy-and-paste-icon",
      element: null,
      classes: '',
      styles: {
        // width: '100%',
        // "vertical-align": "top",
        // 'font-size': '15px'
      },
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

    formGroupArchetype: {
      selector: '[data-kol-editor=copy-and-paste] > .input-group',
      element: null,
      classes: '',
      styles: 'max-width: initial;',
    },

    mailtoArchetype: {
      selector: "a[href*=mailto]",
      element: null,
      classes: '',
      styles: '',
    },


    divLayoutArchetype: {
      selector: 'div.kol-share-links',
      element: null,
      // classes: 'col-sm-12 col-sm-offset-0',
      styles: {
        "margin-bottom": "5px",
      },
    },
    // divLayoutArchetype: {
    //   selector: '[data-kol-editor="copy-and-paste"]',
    //   element: null,
    //   classes: 'col-sm-12 col-sm-offset-0',
    //   styles: {
    //     "margin-bottom": "5px",
    //   },
    // },
  },
}


export default kickoffLabs
