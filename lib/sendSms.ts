// lib/sendSms.ts
// Helper function to send SMS via Traccar SMS Gateway exposed through Cloudflared
// Reads SMS_URL and SMS_KEY from environment variables

import fetch from 'node-fetch';

export async function sendSms(to: string, message: string): Promise<void> {
  const smsUrl = process.env.SMS_URL;
  const smsKey = process.env.SMS_KEY;
  if (!smsUrl || !smsKey) {
    throw new Error('SMS_URL or SMS_KEY is not set in environment variables');
  }

  // POST request to SMS Gateway
  const res = await fetch(smsUrl, {
    method: 'POST',
    headers: {
      'Authorization': smsKey,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ to, message }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SMS Gateway error: ${res.status} ${errorText}`);
  }
}

// Usage: await sendSms('+905xxxxxxxxx', 'Merhaba Dünya!')
// Throws error if sending fails
