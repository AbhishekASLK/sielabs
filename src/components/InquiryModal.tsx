'use client';

import React, { useState, useEffect } from 'react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

// Crisp, pleasant pop chime sound using Web Audio API (zero external assets needed)
function playPopSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Pop tone: sweet upward chirp
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(420, now);
    osc1.frequency.exponentialRampToValueAtTime(860, now + 0.08);

    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.16);

    // Warm bell resonance harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(860, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(1280, now + 0.14);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.setValueAtTime(0.12, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.04);
    osc2.stop(now + 0.24);
  } catch (e) {
    // Audio autoplay or web audio not permitted in silent mode
  }
}

export default function InquiryModal({ isOpen, onClose, defaultProgram = 'Python with Machine Learning (4 Months)' }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState(defaultProgram);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Play pop sound when widget opens
  useEffect(() => {
    if (isOpen) {
      playPopSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          program: program.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setMessage('');
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <>
      {/* Transparent backdrop to catch clicks outside the widget */}
      <div
        onClick={handleReset}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          backgroundColor: 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Compact bottom-right widget card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connect with SieLabs"
        className="inquiry-widget-card"
        style={{
          position: 'fixed',
          bottom: '84px',
          right: '24px',
          width: '325px',
          maxWidth: 'calc(100vw - 28px)',
          backgroundColor: '#FAF9F5',
          border: '1px solid #E5E3DC',
          borderRadius: '18px',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.16), 0 3px 12px rgba(0, 0, 0, 0.05)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transformOrigin: 'bottom right',
          animation: 'inquiryWidgetFlyout 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Compact Header */}
        <div
          style={{
            padding: '12px 14px 9px',
            borderBottom: '1px solid #EDE9DF',
            position: 'relative',
            backgroundColor: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(217, 119, 87, 0.12)',
              borderRadius: '9999px',
              padding: '1px 8px',
              fontSize: '10px',
              fontWeight: 600,
              color: '#D97757',
              marginBottom: '3px',
            }}
          >
            <span>SieLabs</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Close widget"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#F3F1EC',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6E6D68',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E2D9';
              e.currentTarget.style.color = '#141413';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F1EC';
              e.currentTarget.style.color = '#6E6D68';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '16.5px',
              fontWeight: 500,
              color: '#141413',
              margin: '0 0 1px 0',
              lineHeight: 1.25,
            }}
          >
            {isSuccess ? 'Request Received!' : 'Connect with SieLabs'}
          </h3>
          <p
            style={{
              fontSize: '11px',
              color: '#6E6D68',
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            {isSuccess
              ? 'Our mentors will message you on WhatsApp shortly.'
              : "We'll call or WhatsApp you directly."}
          </p>
        </div>

        {/* Compact Body */}
        <div style={{ padding: '11px 14px 13px', overflowY: 'auto', maxHeight: '420px' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(217, 119, 87, 0.12)',
                  color: '#D97757',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  border: '1.5px solid rgba(217, 119, 87, 0.3)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#141413', margin: '0 0 4px' }}>
                Thank you, {name}!
              </h4>
              <p style={{ fontSize: '12px', color: '#6E6D68', lineHeight: 1.45, margin: '0 0 14px' }}>
                Our mentors will message or call you at <strong>{phone}</strong> regarding <strong>{program}</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <a
                  href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: '#D97757',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                  </svg>
                  Join WhatsApp Community
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '7px 14px',
                    backgroundColor: 'transparent',
                    border: '1px solid #DCD8CD',
                    borderRadius: '9999px',
                    color: '#6E6D68',
                    fontWeight: 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {errorMsg && (
                  <div
                    style={{
                      padding: '6px 9px',
                      backgroundColor: 'rgba(220, 38, 38, 0.08)',
                      border: '1px solid rgba(220, 38, 38, 0.25)',
                      borderRadius: '7px',
                      color: '#DC2626',
                      fontSize: '11px',
                      lineHeight: 1.3,
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#141413', marginBottom: '2px' }}>
                    Your Name <span style={{ color: '#D97757' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 9px',
                      fontSize: '12.5px',
                      borderRadius: '7px',
                      border: '1px solid #DCD8CD',
                      backgroundColor: '#FFFFFF',
                      color: '#141413',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#D97757')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#DCD8CD')}
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#141413', marginBottom: '2px' }}>
                    Phone / WhatsApp Number <span style={{ color: '#D97757' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 9px',
                      fontSize: '12.5px',
                      borderRadius: '7px',
                      border: '1px solid #DCD8CD',
                      backgroundColor: '#FFFFFF',
                      color: '#141413',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#D97757')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#DCD8CD')}
                  />
                </div>

                {/* Program of Interest */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#141413', marginBottom: '2px' }}>
                    Program
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 9px',
                      fontSize: '12px',
                      borderRadius: '7px',
                      border: '1px solid #DCD8CD',
                      backgroundColor: '#FFFFFF',
                      color: '#141413',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Python with Machine Learning (4 Months)">Python with Machine Learning</option>
                    <option value="Open Source Mindset">Open Source Mindset</option>
                    <option value="General Inquiry / Mentorship">General Inquiry / Mentorship</option>
                  </select>
                </div>

                {/* Message / Question */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#141413', marginBottom: '2px' }}>
                    Message <span style={{ fontSize: '10px', fontWeight: 400, color: '#9C9A92' }}>(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ask a question or request callback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '5px 9px',
                      fontSize: '12px',
                      borderRadius: '7px',
                      border: '1px solid #DCD8CD',
                      backgroundColor: '#FFFFFF',
                      color: '#141413',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s ease',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#D97757')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#DCD8CD')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    backgroundColor: '#D97757',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.75 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(217, 119, 87, 0.25)',
                    transition: 'background 0.15s ease',
                    marginTop: '2px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C96442';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = '#D97757';
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Request Callback →'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '10px', color: '#9C9A92', margin: '0' }}>
                  We'll contact you on WhatsApp / Phone.
                </p>
              </form>
          )}
        </div>
      </div>
    </>
  );
}
