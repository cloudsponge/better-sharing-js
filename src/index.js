import emailForm from './lib/emailForm'
try {
  emailForm.run()
} catch (e) {
  // 
  console.error(`There was a problem loading BetterSharing: ${e}`)
}

export default emailForm
