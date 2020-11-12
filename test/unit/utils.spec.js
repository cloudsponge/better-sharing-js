import { addJavascript } from '../../src/lib/utils'

describe('addJavascript', () => {
  it('adds a script to the page', () => {
    const createElementSpy = jest.spyOn(document, 'createElement')
    addJavascript()
    expect(createElementSpy).toHaveBeenCalled()
  })
  it('assigns the src to the script', () => {
    const script = addJavascript('http://localhost/src.js', 'firstTest')
    expect(script.src).toEqual('http://localhost/src.js')
  })
  it('assigns an id to the script', () => {
    const script = addJavascript('http://localhost/src.js', 'secondTest')
    expect(script.id).toEqual('secondTest')
  })
  it('does not add the script twice', () => {
    const script = addJavascript('http://localhost/src.js', 'thirdTest')
    expect(script).not.toBeNull()
    const script2 = addJavascript('http://localhost/src.js', 'thirdTest')
    expect(script2).toBe(script)
  })
  it('executes the callback if the script already exists', () => {
    const cb = jest.fn()
    addJavascript('http://localhost/src.js', 'fourthTest')
    addJavascript('http://localhost/src.js', 'fourthTest', cb)
    expect(cb).toHaveBeenCalled()
  })

  it('executes the callback after the script loads', () => {
    const script = document.createElement('script')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => script)
    const cb = () => {
      expect(script.onload).toBeNull()
    }
    addJavascript('http://localhost/src.js', 'fifthTest', cb)
    expect(typeof script.onload).toEqual('function')
    expect(typeof script.onreadystatechange).toEqual('function')
    expect(script.onload).toBe(script.onreadystatechange)

    script.onload()
  })

  it('executes the callback after the script loads (with readyState == loaded)', () => {
    const script = document.createElement('script')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => script)
    const cb = jest.fn().mockImplementation(() => {
      expect(script.onreadystatechange).toBeNull()
    })
    addJavascript('http://localhost/src.js', 'sixthTest', cb)
    expect(typeof script.onreadystatechange).toEqual('function')
    expect(script.onload).toBe(script.onreadystatechange)

    script.readyState = 'interactive'
    script.onreadystatechange()
    expect(cb).not.toHaveBeenCalled()
    script.readyState = 'loaded'
    script.onreadystatechange()
    expect(cb).toHaveBeenCalled()
  })

  it('executes the callback after the script loads (with readyState == complete)', () => {
    const script = document.createElement('script')
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => script)
    const cb = jest.fn().mockImplementation(() => {
      expect(script.onreadystatechange).toBeNull()
    })
    addJavascript('http://localhost/src.js', null, cb)
    expect(typeof script.onreadystatechange).toEqual('function')
    expect(script.onload).toBe(script.onreadystatechange)

    script.readyState = 'interactive'
    script.onreadystatechange()
    expect(cb).not.toHaveBeenCalled()
    script.readyState = 'complete'
    script.onreadystatechange()
    expect(cb).toHaveBeenCalled()
  })

  it('gets the document if the head is not available', () => {
    const getElementsByTagNameSpy = jest
      .spyOn(document, 'getElementsByTagName')
      .mockImplementation(() => [])
    addJavascript('http://localhost/src.js')
    expect(getElementsByTagNameSpy).toHaveBeenCalled()
  })
})
