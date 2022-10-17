# better-sharing.js

[![Build Status](https://api.travis-ci.org/cloudsponge/better-sharing-js.svg?branch=main)](https://travis-ci.org/cloudsponge/better-sharing-js)

Better Sharing adds a better way to send email referrals by creating a form that you can add to any page.

## Installation

### UpViral

UpViral's sharing page includes a `mailto` link for advocates to share their referral code via email.
You can replace the action of this link so that in launches the Contact Picker instead.

In your campaign's "Advanced Settings" find the "Social Share Page Footer codes" and click the "Edit" button.
Then paste the following (making sure to replace your own CloudSponge Key in the value of `data-key` attributes): 
```
  <script
    src="https://unpkg.com/@cloudsponge/better-sharing.js"
    data-key="YOUR_KEY_FROM_CLOUDSPONGE"
    data-selector='[data-href^="mailto:"]'
    data-view="modal"
    data-send-via="mailto"
    crossorigin="anonymous">
  </script>
```

Next, you'll [connect Zapier with your CloudSponge account](https://www.cloudsponge.com/integrations/zapier/) so that it can trigger an action when someone submits the Contact Picker.

### Prefinery

You can override the `mailto:` link functionality of your [Prefinery](https://prefinery.com) campaign.

Edit your Prefinery.com Referral Page. Click the HTML view so you can edit the code on the page. Add the following script at the bottom of the page, after the `{{page.networks}}` section. Make sure to replace your own CloudSponge Key in the value of `data-key` attributes.

```
  <script
    src="https://unpkg.com/@cloudsponge/better-sharing.js"
    data-key="YOUR_KEY_FROM_CLOUDSPONGE"
    data-selector='[href^="mailto:"]'
    data-view="modal"
    data-send-via="mailto"
    crossorigin="anonymous">
  </script>
  <div style="height:500px"></div>
```

Next, you'll [connect Zapier with your CloudSponge account](https://www.cloudsponge.com/integrations/zapier/) so that it can trigger an action when someone submits the Contact Picker.


### KickoffLabs

Customize the user experience when they click on the `mailto` link with Better Sharing on your [KickoffLabs](https://kickofflabs.com/) page.

Edit the "Tracking Codes" for your campaign and include the following code in the Footer Scripts section.
Don't forget to replace the "YOUR CLOUDSPONGE KEY" with your CloudSponge key!

```
<script
  src="https://unpkg.com/@cloudsponge/better-sharing.js"
  data-key="YOUR CLOUDSPONGE KEY"
  data-selector='[href^="mailto:"]'
  data-view="modal"
  data-send-via="mailto"
  data-delay-init="true"
  crossorigin="anonymous">
</script>
<script>var x=setInterval(function(){if(window._kol.component_register.ready&&window.betterSharing){betterSharing();clearTimeout(x);}},100)</script>
```


### Conjured Referrals

Our [Conjured Referrals](https://conjured.co/) integration supports this platform on Shopify. Check out the [Better Sharing for Conjured here](https://www.npmjs.com/package/@cloudsponge/better-sharing-shopify-conjured-referrals.js).


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


## Options

### Different Views

The default display is a simple button. To display the email sending form, add the following option to your script:

    data-view="inline"

To display the email sending form as a modal, launched from a button, use

    data-view="modal"

For example:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing.js"
        data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        data-view="false"
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

### Sending the Emails

After the user completes the Better-Sharing form, they expect one or more emails will be sent. There are a few different ways this can happen. Read

#### Platform Emails

If your platform supports a custom integration with Better Sharing, then they most likely have taken care of this for you.

#### Mailto Emails

This option opens the browser's default email client with the data from the Better Sharing form. The user will only need to review the email and click send in their email client.

Set the option `{sendVia: 'mailto'}`.

This is not our recommended method, but it is the easiest to implement. To maximize the engagement of your customers' emails and the respect for their goodwill, connect with Zapier.


#### Zapier Emails

Set the option `{sendVia: 'zapier'}`. Then read the next section for steps on how to configure Zapier with CloudSponge
and get it sending highly personalized emails directly to your customers' referrals.


## Configure CloudSponge & Zapier

* Add the [HTML code to your page](https://www.loom.com/share/60ded4674a3c4d2da0436357cbb21ce2)
    * Add the `<div>` to your page where you want the form to appear.
    * Add the `<script>` before the closing `body` tag (with your CloudSponge key).
* [Connect CloudSponge to Zapier](https://www.loom.com/share/e52a8d39c94b4452a005736b65ce0040)
* Submit the form once to [train Zapier](https://www.loom.com/share/f9d4ffa0aa614f3c8e5a308c0501d231)
* Create your Zap:
    * [send an "Email by Zapier"](https://www.loom.com/share/c4969d4906d24848a008f276db55a3ce)
