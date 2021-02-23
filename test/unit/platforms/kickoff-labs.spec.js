import {
  holder,
  archetypes,
  html,
  referralLinkParser,
  emailShareBody,
  emailShareSubject,
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

describe('referralLinkParser', () => {
  it('returns null', () => {
    expect(referralLinkParser()).toBeNull()
  })

  it('returns window.kol_lead.social_url', () => {
    window.kol_lead = { social_url: 'the special URL' }
    expect(referralLinkParser()).toEqual('the special URL')
    delete window.kol_lead
  })

  it('returns builds it with window.kol_signup_url', () => {
    window.kol_signup_url = 'http://example.com'
    window.kol_lead = { id: '1234' }
    expect(referralLinkParser()).toEqual('http://example.com?kid=1234')
    delete window.kol_signup_url
    delete window.kol_lead
  })

  it('returns builds it with window.kol_signup_url and __kol_analytics.user.cid', () => {
    window.kol_signup_url = 'http://example.com'
    window.__kol_analytics = {
      user: {
        cid: 'abcd',
      },
    }
    expect(referralLinkParser()).toEqual('http://example.com?kid=abcd')
    delete window.kol_signup_url
    delete window.__kol_analytics
  })

  it('returns cannot build it without __kol_analytics.user.cid', () => {
    window.kol_signup_url = 'http://example.com'
    window.__kol_analytics = {
      user: {},
    }
    expect(referralLinkParser()).toBeNull()
    delete window.kol_signup_url
    delete window.__kol_analytics
  })
})

describe('emailShareBody', () => {
  it('returns empty', () => {
    expect(emailShareBody()).toEqual('')
  })

  it('returns the body', () => {
    window.kol_default_list_options = {
      email_share_body: 'body of the email',
    }
    expect(emailShareBody()).toEqual('body of the email')
    delete window.kol_default_list_options
  })
})

describe('emailShareSubject', () => {
  it('returns empty', () => {
    expect(emailShareSubject()).toEqual('')
  })

  it('returns the subject', () => {
    window.kol_default_list_options = {
      email_share_subject: 'subject of the email',
    }
    expect(emailShareSubject()).toEqual('subject of the email')
    delete window.kol_default_list_options
  })
})
