import options, {
  init,
  afterUpdateOptions,
  defaults,
  reset,
  resetOptions,
} from '../../src/lib/scriptOptions'

describe('initialization', () => {
  const thisScript = {
    dataset: {
      key: 'key',
      betterSharingOption1: '',
    },
    src: '',
  }
  it('finds currentScript', () => {
    const mockCurrentScript = jest
      .spyOn(document, 'currentScript', 'get')
      .mockImplementation(() => {
        return thisScript
      })
    const scriptDataOptions = init()
    expect(mockCurrentScript).toHaveBeenCalled()
    expect(options()).toEqual(thisScript.dataset)
    resetOptions(scriptDataOptions)
    expect(options()).toEqual({})
    mockCurrentScript.mockRestore()
  })
  it('finds the script by data attribute', () => {
    // data-better-sharing-key
    const mockCurrentScript = jest
      .spyOn(document, 'querySelector')
      .mockImplementation(() => {
        return thisScript
      })
    const scriptDataOptions = init()
    expect(mockCurrentScript).toHaveBeenCalled()
    expect(options()).toEqual(thisScript.dataset)
    resetOptions(scriptDataOptions)
    expect(options()).toEqual({})
    mockCurrentScript.mockRestore()
  })
  it('finds the script by dataset', () => {
    // data-better-sharing-key
    const mockCurrentScript = jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(() => {
        return [thisScript]
      })
    const scriptDataOptions = init()
    expect(mockCurrentScript).toHaveBeenCalled()
    expect(options()).toEqual(thisScript.dataset)
    resetOptions(scriptDataOptions)
    expect(options()).toEqual({})
    mockCurrentScript.mockRestore()
  })
  it('finds the script by src', () => {
    thisScript.src = 'somestuffthatincludesbetter-sharingok?'
    // data-better-sharing-key
    const mockCurrentScript = jest
      .spyOn(document, 'querySelectorAll')
      .mockImplementation(() => {
        return [thisScript]
      })
    const scriptDataOptions = init()
    expect(mockCurrentScript).toHaveBeenCalled()
    expect(options()).toEqual(thisScript.dataset)
    resetOptions(scriptDataOptions)
    expect(options()).toEqual({})
    mockCurrentScript.mockRestore()
    thisScript.src = ''
  })
})

describe('options', () => {
  beforeEach(() => {
    reset()
    resetOptions(defaults())
    resetOptions(defaults(null, true))
  })

  it('returns the options', () => {
    expect(options()).toEqual({})
  })
  it('sets options and gets them back', () => {
    const newOpts = {
      new: 'option',
      now: new Date(),
    }
    expect(options(newOpts)).toEqual(newOpts)
  })
  it('sets options and gets them back again', () => {
    const newOpts = {
      new: 'next Option',
      now: new Date(),
    }
    options(newOpts)
    expect(options()).toEqual(newOpts)
  })
  it('merges options from subsequent calls', () => {
    options({ first: 0 })
    options({ second: 1 })
    expect(options()).toEqual({ first: 0, second: 1 })
  })
  it('inherits the default options', () => {
    defaults({ default: 0, first: 'default' })
    expect(options()).toEqual({ default: 0, first: 'default' })
  })
  it('overrides the default options', () => {
    defaults({ default: 0, first: 'default' })
    expect(options({ default: 1, first: undefined })).toEqual({
      default: 1,
      first: undefined,
    })
  })
  it('inherits the immutable default options', () => {
    defaults({ default: 0, first: 'default' }, true)
    expect(options()).toEqual({ default: 0, first: 'default' })
  })
  it('does not overrides the immutable default options', () => {
    defaults({ default: 0, first: 'default' }, true)
    expect(options({ default: 1, first: undefined })).toEqual({
      default: 0,
      first: 'default',
    })
  })
  it('does not execute callbacks', () => {
    const callback = jest.fn()
    afterUpdateOptions(callback)
    options()
    expect(callback).not.toHaveBeenCalled()
  })
  it('executes callbacks', () => {
    const callback = jest.fn()
    afterUpdateOptions(callback)
    options({})
    expect(callback).toHaveBeenCalled()
  })
  it('avoids infinite recursion', () => {
    const callback = jest.fn().mockImplementation(() => {
      options({ new: 'data' })
    })
    afterUpdateOptions(callback)
    options({})
    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls.length).toEqual(1)
  })
})
