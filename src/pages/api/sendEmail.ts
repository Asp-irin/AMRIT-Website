export const prerender = false; //This will not work without this line

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  console.log(data)
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        message: `Fill out all fields.`,
      }),
      {
        status: 404,
        statusText: "Did not provide the right data",
      },
    );
  } // Sending information to Resend

  const sendResend = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "amrit@piramalswasthya.org",
    subject: `Submission from ${name}`,
    html: `<p>
    From: ${name}
    Email: ${email}
    Message: ${message}
    </p>`,
  });

  if (sendResend.data) {
    return new Response(
      JSON.stringify({
        message: `Message successfully sent!`,
      }),
      {
        status: 200,
        statusText: "OK",
      },
    );
  } else {
    return new Response(
      JSON.stringify({
        message: `Message failed to send: ${sendResend.error}`,
      }),
      {
        status: 500,
        statusText: `Internal Server Error: ${sendResend.error}`,
      },
    );
  }
};
