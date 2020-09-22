import emailForm from './lib/emailForm'
try {
  emailForm.run()
} catch (e) {
  // not much we can do but report the problem and exit
  console.error(`[BetterSharing] There was a problem loading: ${e}`)
}

export default emailForm
