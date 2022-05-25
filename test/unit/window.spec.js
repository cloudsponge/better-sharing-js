import { findAncestor, addLoadHandler } from '../../src/lib/window'

describe('findAncestor', () => {
  it('finds nothing when no element given', () => {
    expect(findAncestor(null, '')).toEqual(null)
  })
  it('finds nothing when element has no parentElement prop', () => {
    expect(findAncestor({}, '')).toEqual(null)
  })
  it('finds the parent', () => {
    const parentEl = {
      matches: () => {
        return true
      },
    }
    const el = {
      parentElement: parentEl,
    }
    expect(findAncestor(el, '')).toEqual(parentEl)
  })
  it('finds the grandparent', () => {
    const grandparentEl = {
      matches: () => {
        return true
      },
    }
    const parentEl = {
      matches: () => {
        return false
      },
      parentElement: grandparentEl,
    }
    const el = {
      parentElement: parentEl,
    }
    expect(findAncestor(el, '')).toEqual(grandparentEl)
  })
  it('finds with matchesSelector grandparent', () => {
    const grandparentEl = {
      matchesSelector: () => {
        return true
      },
    }
    const parentEl = {
      matchesSelector: () => {
        return false
      },
      parentElement: grandparentEl,
    }
    const el = {
      parentElement: parentEl,
    }
    expect(findAncestor(el, '')).toEqual(grandparentEl)
  })
  it('finds nothing', () => {
    const grandparentEl = {
      matches: () => {
        return false
      },
      parentElement: null,
    }
    const parentEl = {
      matches: () => {
        return false
      },
      parentElement: grandparentEl,
    }
    const el = {
      parentElement: parentEl,
    }
    expect(findAncestor(el, '')).toEqual(null)
  })
})

describe('addLoadHandler', () => {
  it('calls the handler when the page has already loaded', () => {
    const handler = jest.fn()
    addLoadHandler(handler)
    expect(handler).toHaveBeenCalled()
  })
  it('does not call the handler when the page is still loading', () => {
    const handler = jest.fn()
    jest.spyOn(document, 'readyState', 'get').mockImplementation(() => {
      return 'loading'
    })
    const eventSpy = jest.spyOn(window, 'addEventListener')
    addLoadHandler(handler)
    expect(handler).not.toHaveBeenCalled()
    expect(eventSpy).toHaveBeenCalled()
    // simulate complete loading the page
    window.dispatchEvent(new Event('load'))
    expect(handler).toHaveBeenCalled()
  })
  it('calls attachEvent', () => {
    const handler = jest.fn()
    jest.spyOn(document, 'readyState', 'get').mockImplementation(() => {
      return 'loading'
    })
    const windowAddEventListener = window.addEventListener
    window.addEventListener = null
    document.attachEvent = jest.fn()
    addLoadHandler(handler)
    expect(handler).not.toHaveBeenCalled()
    expect(document.attachEvent).toHaveBeenCalled()
    // clean up
    document.attachEvent.mockClear()
    delete document.attachEvent
    window.addEventListener = windowAddEventListener
  })
  it('calls nothing', () => {
    const handler = jest.fn()
    jest.spyOn(document, 'readyState', 'get').mockImplementation(() => {
      return 'loading'
    })
    const windowAddEventListener = window.addEventListener
    window.addEventListener = null
    addLoadHandler(handler)
    expect(handler).not.toHaveBeenCalled()
    window.addEventListener = windowAddEventListener
  })
})
