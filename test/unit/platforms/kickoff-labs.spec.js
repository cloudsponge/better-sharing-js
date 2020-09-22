import { holder, archetypes, css, html } from '../../../src/lib/platforms/kickoff-labs'

describe('holder', () => {
  it('has the expected properties', () => {
    expect(Object.keys(holder)).toEqual(['selector', 'classes', 'ancestorSelector'])
  })
})

describe('archetypes', () => {
  it('has the expected properties', () => {
    expect(Object.keys(archetypes)).toEqual(['buttonArchetype', 'iconArchetype', 'inputArchetype', 'mailtoArchetype'])
  })
})

describe('css', () => {
  it('returns a style tag', () => {
    expect(css()).toMatch(/^<style>/)
    expect(css()).toMatch(/<\/style>$/m)
  })
})

describe('html', () => {
  it('returns a div tag', () => {
    expect(html()).toMatch(/<div class="better-sharing-email-form">/)
    expect(html()).toMatch(/<\/div>$/m)
  })
})
