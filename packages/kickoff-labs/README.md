Better# better-sharing-kickoff-labs.js

Better Sharing adds a better way to send email referrals by creating a form that you can add to your [KickoffLabs](https://kickofflabs.com/) campaign.

## Installation

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="better-sharing-inline-email-form">Better Sharing will load here. 🔧 Made with ❤️ by CloudSponge.</div>

Add the script to your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing-kickoff-labs.js"
        data-key="[your key from CloudSponge]"
        data-subject="[email subject]"
        data-body="[email body without the referral link]"
        data-sender-email="[a verified sender email address for your ESP]"
        data-default-sender-name="[name of the sender when the user's is not available]"
        data-default-reply-to-email="[email to reply to when the user's is not available]"
        data-default-reply-to-name="[name of the when the user's is not available]"
        crossorigin="anonymous">
    </script>

You will customize the script to work for your own purposes by replacing the attribute values in the example above.

### Sender email

There are two important things to consider with regards to the sender email. Because your Email Service Provider (ESP) is sending the email at the request of your user, you need to use a **verified email address** and you need to **authenticate your domain**. These two steps will greatly enhance deliverability, open rates and ultimately the engagement of your emails.

You should set your sender email as one of the email address that you verified with your Email Service Provider (ESP). Some ESPs require that the sender email matches one that they have verified already. If your ESP doesn't require it, do it anyway. Sending from a verified email address reduces the risk of your emails getting caught in spam or marketing filters.

When it comes to ensuring deliverability, an additional best practice is to authenticate your domain for sending through your ESP. How you do this is specific to your ESP. It involves adding entries to your DNS that identifies and verifies their mail service. Each ESP has documentation on how to set this up.

### A note about default values

The best experience for the recipient of these emails happens when the user uses the [CloudSponge Contact Picker](https://www.cloudsponge.com/contact-picker/) to connect their address book so that Better Sharing is able to populate the sender's details. Engagement with the Contact Picker is not a required step so we must ensure that there are some default values to fall back to.

Without these values, your Zap may fail.

Here's a few suggestions to use:

default-sender-name: You could use the name of your brand or the name of this specific campaign. This will appear next to your verified sender email address, so its branding should align.
default-reply-to-email: You could use an organizational email address, optionally your sender email.
default-reply-to-name: You could use the name of your brand or the name of this specific campaign.

### Alternative option definition

If you want to configure these values in Javascript code rather than as HTML attributes, you can call the `betterSharing.options({})` function and pass in the values as below:

    betterSharing.options({
      key: "[your key from CloudSponge]",
      senderEmail: "[a verified email address for your ESP]",
      defaultSenderName: "[name of the sender when the user's is not available]",
      defaultReplyToEmail: "[email to reply to when the user's is not available]",
      defaultReplyToName: "[name of the when the user's is not available]",
    });

Define each value in either the HTML or the Javascript, but not both.


## Configure CloudSponge & Zapier

### OAuth & Your Proxy URL

You'll be asked for your Proxy URL as you go about setting up OAuth for Google, Yahoo and Microsoft address books. Don't be intimidated! You've made a good choice by using the BetterSharing plugin on KickoffLabs. The Thank-you page you added your script to *is* your Proxy URL. Use the URL as it shows up in your Basic Settings, without any query parameters.

For example, if your thank you page is hosted here: `https://thanks-referrals.kickoffpages.com/?preview=true&contest_score=2`, use everything up to the `?`: `https://thanks-referrals.kickoffpages.com/` as your Proxy URL.

This is the same URL that you'll use when you are asked for your Authorized Redirect URI by Google, Yahoo or Microsoft.

See the [better-sharing.js project](https://www.npmjs.com/package/@cloudsponge/better-sharing.js) for much more information on how to set up email sending via the Contact Picker Zapier app.
