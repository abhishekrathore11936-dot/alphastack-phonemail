import React, { useState } from 'react';

export default function ChatDetails({ chat, darkMode, onBack, onUpdateChat }) {
  const [isBlocked, setIsBlocked] = useState(chat?.blocked || false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const bgApp = darkMode ? '#111b21' : '#f0f2f5';
  const cardBg = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subColor = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e2e8f0';

  const handleToggleBlock = () => {
    const newBlockedState = !isBlocked;
    setIsBlocked(newBlockedState);
    if (onUpdateChat) {
      onUpdateChat({ ...chat, blocked: newBlockedState });
    }
  };

  const handleReportSubmit = () => {
    alert(`Report submitted for ${chat?.name || 'Entity'}. Thank you for keeping PhoneMail secure.`);
    setShowReportModal(false);
    setReportReason('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgApp, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Contact Info</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Profile Card */}
        <div style={{ backgroundColor: cardBg, padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#00A884', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
            {chat ? chat.name[0] : 'P'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor, textAlign: 'center' }}>
            {chat ? chat.name : 'Entity Name'}
          </div>
          <div style={{ fontSize: '13px', color: '#00A884' }}>
            {chat ? `${chat.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@phonemail.com` : 'support@phonemail.com'}
          </div>
          <div style={{ backgroundColor: darkMode ? '#111b21' : '#e2e8f0', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', color: textColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔒 Verified Official Gateway</span>
          </div>
        </div>

        {/* Encryption & Protocol */}
        <div style={{ backgroundColor: cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00A884', marginBottom: '8px' }}>ENCRYPTION & PROTOCOL</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '4px' }}>End-to-End Encrypted</div>
          <div style={{ fontSize: '12px', color: subColor }}>
            Messages and emails sent to and from {chat?.name || 'this entity'} are secured with RSA-2048 bit cryptographic keys over IMAP/SMTP gateway.
          </div>
        </div>

        {/* Shared Documents & Attachments */}
        <div style={{ backgroundColor: cardBg, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00A884', marginBottom: '8px' }}>SHARED DOCUMENTS & ATTACHMENTS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', backgroundColor: darkMode ? '#111b21' : '#f0f2f5' }}>
            <span style={{ fontSize: '24px' }}>📄</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: textColor }}>{chat?.name ? `${chat.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_document.pdf` : 'secure_document.pdf'}</div>
              <div style={{ fontSize: '11px', color: subColor }}>2.4 MB • Secure PDF</div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Block/Unblock & Report) */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', border: `1px solid ${borderColor}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div 
            onClick={handleToggleBlock}
            style={{ padding: '16px', color: isBlocked ? '#00A884' : '#df3333', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', borderBottom: `1px solid ${borderColor}` }}
          >
            {isBlocked ? `Unblock ${chat?.name || 'Entity'}` : `Block ${chat?.name || 'Entity'}`}
          </div>
          <div 
            onClick={() => setShowReportModal(true)}
            style={{ padding: '16px', color: '#df3333', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}
          >
            Report Official Entity
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '340px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor }}>🚨 Report Official Entity</div>
            <div style={{ fontSize: '12px', color: subColor }}>Please specify the reason for reporting {chat?.name}:</div>
            <textarea 
              rows="3"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Spam, phishing, suspicious activity..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setShowReportModal(false)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: 'transparent', color: textColor, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleReportSubmit}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#df3333', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}