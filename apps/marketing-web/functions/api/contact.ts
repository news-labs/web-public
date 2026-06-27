interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface Env {
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function sendViaMailChannels(
  to: string,
  from: string,
  subject: string,
  text: string,
  replyTo: string,
): Promise<boolean> {
  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "Newsfork Contact" },
      reply_to: { email: replyTo },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });

  return response.ok;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  let payload: ContactPayload;

  const contentType = context.request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    payload = (await context.request.json()) as ContactPayload;
  } else {
    const form = await context.request.formData();
    payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    };
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const subject = payload.subject?.trim() || "Newsfork inquiry";
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    return jsonResponse({ error: "Name, email, and message are required." }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: "Invalid email address." }, 400);
  }

  const to = context.env.CONTACT_TO_EMAIL ?? "hello@newsfork.com";
  const from = context.env.CONTACT_FROM_EMAIL ?? "noreply@newsfork.com";
  const text = `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;

  const sent = await sendViaMailChannels(to, from, `[Newsfork] ${subject}`, text, email);

  if (!sent) {
    return jsonResponse(
      {
        error:
          "Unable to send message at this time. Please email hello@newsfork.com directly.",
      },
      502,
    );
  }

  return jsonResponse({ ok: true });
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}
