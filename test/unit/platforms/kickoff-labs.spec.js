import {
  holder,
  archetypes,
  html,
} from '../../../src/lib/platforms/kickoff-labs'

describe('holder', () => {
  it('has the expected properties', () => {
    expect(Object.keys(holder)).toEqual([
      'selector',
      'classes',
      'ancestorSelector',
    ])
  })
})

describe('archetypes', () => {
  it('has the expected properties', () => {
    expect(Object.keys(archetypes)).toEqual([
      'buttonArchetype',
      'iconArchetype',
      'inputArchetype',
      'mailtoArchetype',
    ])
  })
})

describe('css', () => {
  it('returns a style tag', () => {
    expect(html()).toMatch(/^<style>/m)
    expect(html()).toMatch(/<\/style>$/m)
  })
})

describe('html', () => {
  it('returns a div tag', () => {
    expect(html()).toMatch(/<div class="better-sharing-email-form">/g)
    expect(html()).toMatch(/<\/div>$/m)
  })
})
