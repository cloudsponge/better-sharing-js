# better-sharing.js

[![Build Status](https://api.travis-ci.org/cloudsponge/better-sharing-js.svg?branch=main)](https://travis-ci.org/cloudsponge/better-sharing-js)

Better Sharing adds a better way to send email referrals by creating a form that you can add to any page.

## Installation

### UpViral

UpViral's sharing page includes a `mailto` link for advocates to share their referral code via email.
You can replace the action of this link so that in launches the Contact Picker instead.

In your campaign's "Advanced Settings" find the "Social Share Page Footer codes" and click the "Edit" button.
Then paste the following: 
```
  <script
    src="https://unpkg.com/@cloudsponge/better-sharing.js"
    data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
    data-mailto="delayNoMailto"
    data-selector='[data-href^="mailto:"]'
    data-senderEmail="support@cloudsponge.com"
    data-defaultSenderName="Better Sharing"
    crossorigin="anonymous">
  </script>
```

### HTML

Better Sharing can be used on any platform that supports custom HTML and Javascript.

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="better-sharing">The Better Sharing inline email form will load here.</div>

Add the script to your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing.js"
        data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        crossorigin="anonymous">
    </script>

Optionally, configure your betterSharing object with more options:

    <script>
      betterSharing({
        cloudsponge: {
          sources: ['gmail', 'yahoo', 'windowslive']
        }
      });
    </script>

### Variations

The default display is a simple button. To display the email sending form, add the following option to your script:

    data-display-email-form="true"

For example:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing.js"
        data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        data-display-email-form="true"
        crossorigin="anonymous">
    </script>

### Customizations

You can customize the text on the contact picker button by specifying the betterSharing options like below:

    <script>
      betterSharing({
        contactPickerButton: {
          label: 'Connect your Address Book',
        },
      });
    </script>

## Configure CloudSponge & Zapier

* Add the [HTML code to your page](https://www.loom.com/share/60ded4674a3c4d2da0436357cbb21ce2)
    * Add the `<div>` to your page where you want the form to appear.
    * Add the `<script>` before the closing `body` tag (with your CloudSponge key).
* [Connect CloudSponge to Zapier](https://www.loom.com/share/e52a8d39c94b4452a005736b65ce0040)
* Submit the form once to [train Zapier](https://www.loom.com/share/f9d4ffa0aa614f3c8e5a308c0501d231)
* Create your Zap:
    * [send an "Email by Zapier"](https://www.loom.com/share/c4969d4906d24848a008f276db55a3ce)
