import { status } from "itty-router-extras"

// import emails from '../../_emails.json'
import { handleResponse } from "../@js/utils"

export default async (request, env, ctx) => {
  // const { query } = request
  // const { cursor: c, limit = 100 } = query
  const { SENDGRID_API_KEY } = env

  // const { keys, cursor, list_complete } = await ACCOUNTS.list({
  //   cursor: c,
  //   limit
  // })

  // const accounts = await Bluebird.map(keys, async ({name}) => {
  //   const value = JSON.parse(Buffer.from(await ACCOUNTS.get(name), 'base64'))
    
  //   delete value.pending_files

  //   if (value.email) {
  //     value.email = (value.email.match(/(?<=\<).*(?=\>)/gi)?.[0] || value.email).toLowerCase()
  //     return value
  //   }
  // }, {concurrency: 10})

  // return json({
  //   cursor,
  //   list_complete,
  //   emails: compact(accounts).map(({email}) => email)
  // })

  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: emails
        .filter((email) => email.indexOf('@') > -1)
        .map((email) => ({to: [{email}]})),
      subject: 'Want to give Apple Card for YNAB another try?',
      content: [{
        type: 'text/html',
        value: `
          <h1>You tried Apple Card for YNAB awhile ago.</h1>
          <h2>Looks like maybe it didn't go so great.</h2>
          <p>We made some changes recently so if you'd like to give it another try just start by sending an Apple Card CSV to <a href="https://applecardforynab.com/">parse@applecardforynab.com</a>.</p>
          <p>If not no worries we'll be deleting your half baked account later this month.</p>
          <br/>
          <br/>
          <aside>Need a little more info? Read our <a href="https://applecardforynab.com/assets/docs/privacy.md">privacy policy</a>.</aside>
        `
      }],
      from: {
        email: 'noreply@applecardforynab.com',
      }
    })
  })
  .then(handleResponse)

  return status(204)
}