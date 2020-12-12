import options, { reset as resetOptions } from '../../src/lib/scriptOptions'
// need to mock the platform specific implementation because our build
// replaces the TARRGET_PLATFORM
const platform = require('../../src/lib/platforms')

let archetypes = {}

describe('initArchetypes', () => {
  beforeEach(() => {
    archetypes = {
      buttonArchetype: {
        selector: 'button.kol-copy-and-paste-icon',
        element: null,
        classes: '',
        styles: '',
      },
    }
  })
  describe('buttonArchetypes', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<style>' +
        `.kol-copy-and-paste-icon {height: 10px; width: 11px; padding: 10px; margin: 10px; border: 1px solid}` +
        '</style>' +
        '<button class="kol-copy-and-paste-icon">' +
        '  <span id="username" />' +
        '</button>'
    })
    it('assigns the element', () => {
      const { buttonArchetype } = archetypes
      platform.initArchetype(buttonArchetype)
      expect(buttonArchetype.element).not.toBe(null)
    })
    it('assigns the styles', () => {
      const { buttonArchetype } = archetypes
      const windowGetComputedStyleSpy = jest.spyOn(window, 'getComputedStyle')
      platform.initArchetype(buttonArchetype)
      expect(windowGetComputedStyleSpy).toHaveBeenCalled()
      expect(buttonArchetype.styles).toMatch(/height:\s+10px/)
      expect(buttonArchetype.styles).toMatch(/width:\s+11px/)
    })
    it('assigns _initialized', () => {
      const { buttonArchetype } = archetypes
      platform.initArchetype(buttonArchetype)
      expect(buttonArchetype._initialized).toBe(true)
    })
    it('returns if already initialized', () => {
      const { buttonArchetype } = archetypes
      buttonArchetype._initialized = true
      const windowGetComputedStyleSpy = jest.spyOn(window, 'getComputedStyle')
      platform.initArchetype(buttonArchetype)
      expect(windowGetComputedStyleSpy).not.toHaveBeenCalled()
    })
  })
})

describe('guessOptionsFromPage', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div></div>`
    resetOptions()
  })

  it('handles a missing mailto', () => {
    platform.guessOptionsFromPage()
    expect(options()).toEqual({
      subject: '',
      body: '',
      referralLink: '',
    })
  })

  it('assigns mailto properties to the options', () => {
    // set it up
    expect(options()).toEqual({})
    const subject = 'this+is+a+subject'
    const body = 'this+is+a+body'
    const referralLink = ''

    document.body.innerHTML = `<a href="mailto:support@cloudsponge.com?subject=${subject}&body=${body}">`

    // execute it
    platform.guessOptionsFromPage()

    // assert!
    expect(options()).toEqual({
      subject,
      referralLink,
      body,
    })
  })
})
