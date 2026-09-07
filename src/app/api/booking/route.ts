const MAX = { name: 120, email: 200, org: 160, linkedin: 240, purpose: 60, message: 500 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = Partial<Record<'name' | 'email' | 'org' | 'linkedin' | 'purpose' | 'message' | 'trap', string>>;

function bad(error: string) {
  return Response.json({ ok: false, error }, { status: 400 });
}

function clean(value: string | undefined, max: number) {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return bad('Could not read the submitted form.');
  }

  // Honeypot: a hidden field only automated submitters fill in. Accept quietly
  // so bots learn nothing, but never forward it.
  if (clean(body.trap, 20)) return Response.json({ ok: true });

  const email = clean(body.email, MAX.email);
  if (!email) return bad('An email address is required.');
  if (!EMAIL_RE.test(email)) return bad('That email address does not look valid.');

  const name = clean(body.name, MAX.name);
  if (!name) return bad('Please add your name.');

  const org = clean(body.org, MAX.org);
  const linkedin = clean(body.linkedin, MAX.linkedin);
  const purpose = clean(body.purpose, MAX.purpose);
  const message = clean(body.message, MAX.message);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO || 'primawijayakusuma38@gmail.com';
  const from = process.env.BOOKING_FROM || 'Portfolio <onboarding@resend.dev>';

  // No mail provider configured yet: tell the client so it can offer a
  // prefilled email rather than silently dropping the request.
  if (!apiKey) {
    return Response.json({ ok: false, reason: 'not_configured' }, { status: 503 });
  }

  const lines = [
    'New booking request from the portfolio site.',
    '',
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Organization: ${org || '—'}`,
    `LinkedIn:     ${linkedin || '—'}`,
    `About:        ${purpose || '—'}`,
    '',
    'Message:',
    message || '—',
  ];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `${purpose || 'Booking request'} — ${name}${org ? ` (${org})` : ''}`,
        text: lines.join('\n'),
      }),
    });

    if (!res.ok) {
      console.error('Resend rejected the booking request:', res.status, await res.text());
      return Response.json({ ok: false, reason: 'send_failed' }, { status: 502 });
    }
  } catch (err) {
    console.error('Could not reach the mail provider:', err);
    return Response.json({ ok: false, reason: 'send_failed' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
