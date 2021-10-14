# better-sharing.js

Better Sharing adds a better way to send email referrals by creating a form that you can add to any page.

## Installation

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="better-sharing-inline-email-form">The Better Sharing inline email form will load here.</div>

Add the script before the closing `</body>` tag on your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing.js"
        data-cloudsponge-key="[YOUR_KEY_FROM_CLOUDSPONGE]"
        crossorigin="anonymous">
    </script>

Optionally, configure your betterSharing object with more options:

    <script>
        betterSharing.options({
            cloudsponge: {
                sources: ['gmail', 'yahoo', 'windowslive']
            }
        })
    </script>

## Configure CloudSponge & Zapier

0. Add the `<div>` to your page
0. Add the `<script>` to your footer (with your CS key)
0. Connect CloudSponge to Zapier
0. Submit the form once to train Zapier
0. Create your Zap
