# better-sharing-kickoff-labs.js

BetterSharing adds a better way to send email referrals by creating a form that you can add to your [KickoffLabs](https://kickofflabs.com/) campaign.

## Installation

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="bettersharing-inline-email-form"></div>

Add the script to your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing-kickoff-labs.js"
        data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        crossorigin="anonymous">
    </script>

## Configure CloudSponge & Zapier

### OAuth & Your Proxy URL

You'll be asked for your Proxy URL as you go about setting up OAuth for Google, Yahoo and Microsoft address books. Don't been intimidated! You've made a good choice by using the BetterSharing plugin on KickoffLabs. The Thank-you page you added your script to *is* your Proxy URL. Use the URL as it shows up in your Basic Settings, without any query parameters.

For example, if your thank you page is hosted here: `https://thanks-referrals.kickoffpages.com/?preview=true&contest_score=2`, use everything up to the `?`: `https://thanks-referrals.kickoffpages.com/` as your Proxy URL. 

This is the same URL that you'll use when you are asked for your Authorized Redirect URI by Google, Yahoo or Microsoft.

See the [better-sharing.js project](https://www.npmjs.com/package/@cloudsponge/better-sharing.js) for much more information on how to set up email sending via the Contact Picker Zapier app.
