# better-sharing.js

BetterSharing adds a better way to send email referrals by creating a form that you can add to any page.

## Installation

Add this HTML content to the page to specify where the form should be added, otherwise, we'll pick a place for you:

    <div class="bettersharing-inline-email-form">The Better Sharing inline email form will load here.</div>

Add the script to your page:

    <script
        src="https://unpkg.com/@cloudsponge/better-sharing-kickoff-pages.js"
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

TK
