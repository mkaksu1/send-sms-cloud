// pages/api/send-sms.ts
// Next.js API route to send SMS using the helper in /lib/sendSms.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { sendSms } from '../../lib/sendSms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Missing phone number or message' });
  }

  try {
    // Güvenli logging: prod ortamında sadece telefon ve zaman loglanır
    if (process.env.NODE_ENV === 'production') {
      // Prod ortamında sadece telefon ve zaman loglanır
      console.log({ phone: to, timestamp: new Date() });
    } else {
      // Geliştirme/test ortamında mesajı maskelenmiş şekilde logla
      console.log({ phone: to, message: '[MASKED]', timestamp: new Date() });
    }
    await sendSms(to, message);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to send SMS' });
  }
}

// Receives POST { to, message } and returns { success, error? }
