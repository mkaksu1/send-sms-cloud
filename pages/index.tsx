// pages/index.tsx
// Minimal SMS gönderme arayüzü. Font: Inter, Renk: Derin mavi.
import { useState } from 'react';

export default function Home() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ to, message }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(data.error || 'Bilinmeyen hata');
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Ağ hatası');
    }
  };

  return (
    <main className="sms-main">
      {/* Inter font import */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div className="sms-card">
        <h1 className="sms-title">SMS Gönder</h1>
        <form onSubmit={handleSend} className="sms-form">
          <label className="sms-label">
            Telefon Numarası
            <input
              type="text"
              placeholder="+905xxxxxxxxx"
              value={to}
              onChange={e => setTo(e.target.value.replace(/[^\d+]/g, '').replace(/^(?!\+)/, '+').slice(0, 14))}
              required
              className={`sms-input ${to && !/^\+905\d{9}$/.test(to) ? 'sms-input-error' : to ? 'sms-input-success' : ''}`}
              pattern="^\+905\d{9}$"
              title="Geçerli bir Türk cep numarası girin."
              autoComplete="tel"
            />
          </label>
          <label className="sms-label">
            Mesaj
            <textarea
              placeholder="Mesajınızı yazın (Türkçe karakterler desteklenir)"
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 320))}
              required
              rows={5}
              className="sms-textarea"
              maxLength={320}
            />
            <div className="sms-charcount">{message.length}/320 karakter</div>
          </label>
          <button
            type="submit"
            disabled={status === 'sending' || !to || !/^\+905\d{9}$/.test(to) || !message}
            className="sms-btn"
          >
            {status === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
        <div className="sms-alerts">
          {status === 'success' && (
            <div className="sms-alert sms-success">SMS başarıyla gönderildi!</div>
          )}
          {status === 'error' && (
            <div className="sms-alert sms-error">Hata: {error}</div>
          )}
        </div>
      </div>
      <style>{`
        body, .sms-main, .sms-card, .sms-title, .sms-label, .sms-input, .sms-textarea, .sms-btn, .sms-charcount {
          font-family: 'Inter', sans-serif !important;
        }
        .sms-main {
          min-height: 100vh;
          background: linear-gradient(120deg, #1e293b 0%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sms-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px #1e293b22;
          padding: 32px 24px;
          max-width: 400px;
          width: 100%;
        }
        .sms-title {
          text-align: center;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 18px;
          color: #1e293b;
        }
        .sms-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .sms-label {
          font-weight: 500;
          color: #2563eb;
          margin-bottom: 4px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sms-input, .sms-textarea {
          padding: 10px;
          font-size: 1rem;
          border-radius: 8px;
          border: 1.5px solid #2563eb;
          outline: none;
          transition: border 0.2s;
          background: #f1f5f9;
        }
        .sms-input:focus, .sms-textarea:focus {
          border-color: #1e293b;
        }
        .sms-input-error {
          border-color: #ef4444 !important;
        }
        .sms-input-success {
          border-color: #22c55e !important;
        }
        .sms-charcount {
          text-align: right;
          font-size: 0.95em;
          margin-top: 2px;
          color: #2563eb;
        }
        .sms-btn {
          padding: 12px 0;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 8px;
          background: linear-gradient(90deg, #1e293b 0%, #2563eb 100%);
          color: #fff;
          border: none;
          box-shadow: 0 2px 8px #2563eb33;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .sms-btn:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        .sms-alerts {
          margin-top: 24px;
          min-height: 32px;
        }
        .sms-alert {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .sms-success {
          background: #e0f2fe;
          color: #2563eb;
          border: 1.5px solid #93c5fd;
        }
        .sms-error {
          background: #fee2e2;
          color: #b91c1c;
          border: 1.5px solid #fecaca;
        }
        @media (max-width: 600px) {
          .sms-card { max-width: 98vw; padding: 12px 4vw; }
        }
      `}</style>
    </main>
  );
}
