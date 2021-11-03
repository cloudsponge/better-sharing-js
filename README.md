# better-sharing.js

[![Build Status](https://api.travis-ci.org/cloudsponge/better-sharing-js.svg?branch=main)](https://travis-ci.org/cloudsponge/better-sharing-js)

Better Sharing adds a better way to send email referrals by creating a form that you can add to any page.

## Installation

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="better-sharing-inline-email-form">The Better Sharing inline email form will load here.</div>

Add the script to your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing.js"
        data-cloudsponge-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
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

## Configure CloudSponge & Zapier

0. Add the [HTML code to your page](https://www.loom.com/share/60ded4674a3c4d2da0436357cbb21ce2)
  * Add the `<div>` to your page where you want the form to appear.
  * Add the `<script>` before the closing `body` tag (with your CloudSponge key).
0. [Connect CloudSponge to Zapier](https://www.loom.com/share/e52a8d39c94b4452a005736b65ce0040)
0. Submit the form once to [train Zapier](https://www.loom.com/share/f9d4ffa0aa614f3c8e5a308c0501d231)
0. Create your Zap:
  * [send an "Email by Zapier"](https://www.loom.com/share/c4969d4906d24848a008f276db55a3ce)
