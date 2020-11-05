# better-sharing-shopify-conjured-referrals.js

BetterSharing multiplies the effectiveness of your [Conjured.co](https://conjured.co/) referral program by making it easy for people to pick their friends, family and coworkers right from their address book. We add a contact picker to the email form that connects to Google, Yahoo, Outlook.com and other address book providers.

## Installation

Append the better-sharing-shopify-conjured-referrals.js script to your Conjured.co installation, add your CloudSponge key and we'll take care of the rest.

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="better-sharing-inline-email-form">BetterSharing will load here. 🔧 Made with ❤️ by CloudSponge.</div>

Add the script to your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing-shopify-conjured-referrals.js"
        data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        crossorigin="anonymous">
    </script>

## Setting options

There are two ways to pass options to the betterSharing object. You can add them to the HTML or you can declare them in the Javascript. 

    betterSharing.options({
      key: "[your key from CloudSponge]",
      senderEmail: "[a verified email address for your ESP]",
      defaultSenderName: "[name of the sender when the user's is not available]",
      defaultReplyToEmail: "[email to reply to when the user's is not available]",
      defaultReplyToName: "[name of the when the user's is not available]",
    });


## Configure CloudSponge & Zapier

### OAuth & Your Proxy URL

You'll be asked for your Proxy URL as you go about setting up OAuth for Google, Yahoo and Microsoft address books. Don't been intimidated! You've made a good choice by using the BetterSharing plugin on KickoffLabs. The Thank-you page you added your script to *is* your Proxy URL. Use the URL as it shows up in your Basic Settings, without any query parameters.

For example, if your thank you page is hosted here: `https://thanks-referrals.kickoffpages.com/?preview=true&contest_score=2`, use everything up to the `?`: `https://thanks-referrals.kickoffpages.com/` as your Proxy URL. 

This is the same URL that you'll use when you are asked for your Authorized Redirect URI by Google, Yahoo or Microsoft.

See the [better-sharing.js project](https://www.npmjs.com/package/@cloudsponge/better-sharing.js) for much more information on how to set up email sending via the Contact Picker Zapier app.
