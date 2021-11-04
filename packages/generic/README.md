# better-sharing.js

Better Sharing adds a better way to send email referrals by creating a form that you can add to any page.

## Installation

Add this HTML content to the page to specify where the form should be added:

    <div class="better-sharing-inline-email-form">Better Sharing will load here. 🔧 Made with ❤️ by CloudSponge.</div>

Add the script before the closing `</body>` tag on your page:

    <script
      src="https://unpkg.com/@cloudsponge/better-sharing.js"
      data-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
      data-sender-email="support@cloudsponge.com"
      data-default-sender-name="Better Sharing"
      data-subject="you will like this"
      data-body="This is a sample referral email. The link below will take you to my rewards page!"
      data-referral-link="https://www.example.com/"
      crossorigin="anonymous">
    </script>


Optionally, configure your betterSharing object with more options:

    <script>
      betterSharing({
        // switch to the deep links version of the plugin
        contactPickerButton: {
          deepLinks: true,
          title: 'Invite people directly from your address book.',
        },
        cloudsponge: {
          sources: ['gmail', 'yahoo', 'outlookcom'],
          skipSourceMenu: true,
        }
      })
    </script>

## Supported options

Options may be set in the `script` tag using `data-` attributes or via the call to `betterSharing({})`.

| Name | Attribute name | Required | Description |
| ---- | -------------- | -------- | ----------- |
| `key` | `data-key` | Yes | Your CloudSponge key |
| `defaultSenderName` | `data-default-sender-name` | Yes | Name of the sender when the sender's is not available |
| `senderEmail` | `data-sender-email` | - | Pass-through value to Zapier so that the sender email that matches with your sending domain can be set here. |
| `subject` | `data-subject` | - | Pass-through value containing the email subject. Zapier will also receive a `Personal Subject` value that includes the recipient's first name, whenever possible. |
| `body` | `data-body` | - | Pass-through data so that default body content can be set here. |
| `referralLink` | `data-referral-link` | - | Pass-through value containing the the referral URL. |

## Configure CloudSponge & Zapier


* Add the [HTML code to your page](https://www.loom.com/share/60ded4674a3c4d2da0436357cbb21ce2)
    * Add the `<div>` to your page where you want the form to appear.
    * Add the `<script>` before the closing `body` tag (with your CloudSponge key).
* [Connect CloudSponge to Zapier](https://www.loom.com/share/e52a8d39c94b4452a005736b65ce0040)
* Submit the form once to [train Zapier](https://www.loom.com/share/f9d4ffa0aa614f3c8e5a308c0501d231)
* Create your Zap:
    * [send an "Email by Zapier"](https://www.loom.com/share/c4969d4906d24848a008f276db55a3ce)
