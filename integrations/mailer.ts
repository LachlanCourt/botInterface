import sgMail from "@sendgrid/mail"

interface MailerProps {
  from?: string
  to: string
  subject: string
  text?: string
  html?: string
}
async function main({ from, to, subject, text = ".", html }: MailerProps) {
  const API_KEY = process.env.SENDGRID_API_KEY || ""
  sgMail.setApiKey(API_KEY)

  // If no from email address is specified, attempt to grab from environment
  if (!from) {
    from = process.env.SENDGRID_EMAIL_ADDRESS
    if (!from) {
      throw new Error("SENDGRID_EMAIL_ADDRESS environment variable missing")
    }
  }

  sgMail
    .send({
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    })
    .then(() => {
      console.log("Email sent")
    })
    .catch((error) => {
      console.error(error)
    })
}

export default main
