# better-sharing-shopify-conjured-referrals.js

Better Sharing multiplies the effectiveness of your [Conjured.co](https://conjured.co/) referral program by making it easy for people to pick their friends, family and coworkers right from their address book. We add a contact picker to the email form that connects to Google, Yahoo, Outlook.com and other address book providers.

## Installation

Append the better-sharing-shopify-conjured-referrals.js script to your Conjured.co installation, add your CloudSponge key and we'll take care of the rest.

In your Shopify account, locate your Conjured Referrals script and add the Better Sharing script immediately after it. 

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing-shopify-conjured-referrals.js"
        data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        crossorigin="anonymous">
    </script>

## Setting options

There are two ways to pass options to the betterSharing object. You can add them to the HTML or you can declare them in the Javascript.

    betterSharing.options({
      key: "[your key from CloudSponge]",
    });

At this time, only the `key` option is supported.

### OAuth & Your Proxy URL

Add a script to your Shopify theme: https://www.npmjs.com/package/@cloudsponge/oauth-connector.js

You'll be asked for your Proxy URL as you go about setting up OAuth for Google, Yahoo and Microsoft address books. Don't been intimidated!

You've made a good choice by using the Better Sharing plugin on Shopify. The page where you installed Conjured Referrals and Better Sharing *is* your Proxy URL.

For example, if your Conjured Referrals form is hosted here: `https://align-integrations.myshopify.com/`, use this as your Proxy URL for setting up OAuth.

This is the same URL that you'll use when you are asked for your Authorized Redirect URI by Google, Yahoo or Microsoft.
