import { useState } from 'react';

export default function HelpSupport({ onBack, darkMode }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Dynamic Theme Colors
  const bgScreen = darkMode ? '#0b141a' : '#f0f2f5';
  const bgCard = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e9edef';

  const faqs = [
    { id: 1, q: 'How does PhoneMail secure my emails?', a: 'PhoneMail tunnels standard IMAP and SMTP traffic through local end-to-end encrypted RSA-2048 bit protocols, mirroring the WhatsApp messaging UX.' },
    { id: 2, q: 'Why is my IMAP sync paused?', a: 'Check your network connectivity or verify your credentials in the Linked IMAP Accounts settings screen.' },
    { id: 3, q: 'Are official attachments verified?', a: 'Yes, documents from entities like PM-Kisan or High Court Registry undergo cryptographic hash verification before previewing.' }
  ];

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgScreen, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', textAlign: 'left' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Help & Support</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        
        {/* Contact Support Tile */}
        <div 
          onClick={() => alert('Support ticket #8841 sent to PhoneMail Engineering Team.')}
          style={{ backgroundColor: bgCard, padding: '16px', borderBottom: `1px solid ${borderColor}`, borderTop: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#00A884', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
            💬
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: textColor }}>Contact Us</div>
            <div style={{ fontSize: '12px', color: subText }}>Get technical support for gateway integration</div>
          </div>
        </div>

        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px', marginTop: '8px' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>

        {/* FAQs */}
        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              style={{ padding: '14px 16px', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer' }}
            >
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{faq.q}</span>
                <span style={{ color: '#00A884', fontSize: '12px' }}>{expandedFaq === faq.id ? '▲' : '▼'}</span>
              </div>
              {expandedFaq === faq.id && (
                <div style={{ fontSize: '13px', color: subText, marginTop: '8px', lineHeight: '1.5' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
