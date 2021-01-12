import betterSharing, { isReady, whenReady, init } from './betterSharing'
import { addJavascript } from '../../../lib/utils'
import svg from './icon.svg'
jest.mock('../../../lib/utils')
jest.mock('./icon.svg')

describe('betterSharing', () => {
  it('is a function', () => {
    expect(typeof betterSharing).toEqual('function')
  })
  it('has an options property', () => {
    expect(typeof betterSharing.options).toEqual('function')
  })

  describe('isReady', () => {
    it('is false', () => {
      expect(isReady()).toBe(false)
    })
    it('is true when the element can be found', () => {
      // document.getElementById('conjured_advocate_share_email')
      const getElementByIdSpy = jest
        .spyOn(document, 'getElementById')
        .mockImplementation(() => {
          return true
        })
      expect(isReady()).toBe(true)
      expect(getElementByIdSpy).toHaveBeenCalled()
      // clean up mocks
      getElementByIdSpy.mockRestore()
    })
  })

  describe('whenReady', () => {
    it('calls setTimeout', () => {
      return new Promise((done) => {
        // set up mocks
        const setTimeoutSpy = jest
          .spyOn(window, 'setTimeout')
          .mockImplementation((fn, timeout) => {
            fn()
            done()
          })
        const execSpy = jest.fn()
        // execute
        whenReady(execSpy)
        // assert
        expect(setTimeoutSpy).toHaveBeenCalled()
        expect(execSpy).not.toHaveBeenCalled()
        // clean up mocks
        setTimeoutSpy.mockRestore()
      })
    })

    it('gives up', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
      const consoleLogSpy = jest.spyOn(window.console, 'log')
      const execSpy = jest.fn()

      whenReady(execSpy, 10)

      expect(setTimeoutSpy).not.toHaveBeenCalled()
      expect(execSpy).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalled()
      // clean up mocks
      setTimeoutSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('calls executable', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout')
      const consoleLogSpy = jest.spyOn(window.console, 'log')
      const getElementByIdSpy = jest
        .spyOn(document, 'getElementById')
        .mockImplementation(() => true)
      const execSpy = jest.fn()

      whenReady(execSpy, 10)

      expect(setTimeoutSpy).not.toHaveBeenCalled()
      expect(execSpy).toHaveBeenCalled()
      expect(consoleLogSpy).not.toHaveBeenCalled()
      // clean up mocks
      setTimeoutSpy.mockRestore()
      consoleLogSpy.mockRestore()
      getElementByIdSpy.mockRestore()
    })
  })

  describe('init', () => {
    it('does not add the js if key is not yet set', () => {
      betterSharing.options({
        key: undefined,
      })
      init()
      expect(addJavascript).not.toHaveBeenCalled()
    })

    it('adds the javascript and inits cloudsponge when the alternate betterSharingKey is used', () => {
      return new Promise((done) => {
        addJavascript.mockImplementation((src, id, cb) => {
          window.cloudsponge = {
            init: jest.fn(),
          }
          cb()
          expect(window.cloudsponge.init).toHaveBeenCalled()
          done()
        })
        betterSharing.options({ betterSharingKey: 'something' })
        init()
        expect(addJavascript).toHaveBeenCalled()
        addJavascript.mockRestore()
      })
    })

    it('adds the javascript and inits cloudsponge', () => {
      return new Promise((done) => {
        addJavascript.mockImplementation((src, id, cb) => {
          window.cloudsponge = {
            init: jest.fn(),
          }
          cb()
          expect(window.cloudsponge.init).toHaveBeenCalled()
          done()
        })
        betterSharing.options({ key: 'something' })
        init()
        expect(addJavascript).toHaveBeenCalled()
        addJavascript.mockRestore()
      })
    })

    it('adds the javascript and does not init cloudsponge', () => {
      return new Promise((done) => {
        addJavascript.mockImplementation((src, id, cb) => {
          window.cloudsponge = null
          cb()
          done()
        })
        betterSharing.options({ key: 'something' })
        init()
        expect(addJavascript).toHaveBeenCalled()
        addJavascript.mockRestore()
      })
    })

    it('does not add the container', () => {
      const querySelectorSpy = jest.spyOn(document, 'querySelector')

      betterSharing.options({
        selector: undefined,
      })

      init()

      expect(querySelectorSpy).not.toHaveBeenCalled()
      querySelectorSpy.mockRestore()
    })

    it('adds the container', () => {
      betterSharing.options({
        selector: '#someElementId',
      })
      document.body.innerHTML = `<div>
          <input id="someElementId" />
        </div>`

      init()

      // it should have added the cloudsponge-contacts class to the element
      expect(document.querySelector('.cloudsponge-contacts')).not.toBeNull()
    })

    it('does not add the container twice', () => {
      betterSharing.options({
        selector: '#someElementId',
      })
      // set up the body with the container class already present
      document.body.innerHTML = `<div class="${
        betterSharing.options().containerClass
      }">
          <input id="someElementId" class="cloudsponge-contacts" />
        </div>`

      init()

      // it should have added the cloudsponge-contacts class to the element
      expect(
        document.querySelectorAll(`.${betterSharing.options().containerClass}`)
          .length
      ).toEqual(1)
    })
  })

  describe('betterSharing()', () => {
    betterSharing({
      selector: '#this',
      key: 'some new key',
    })
  })
})
