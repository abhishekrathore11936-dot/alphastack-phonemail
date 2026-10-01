export default function AttachmentViewer({ fileName, onBack }) {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#0b141a', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', color: '#e9edef' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
            {fileName || 'Secure_Document.pdf'}
          </div>
          <div style={{ fontSize: '11px', color: '#e9edef', textAlign: 'left' }}>Verified PDF Attachment</div>
        </div>
      </div>

      {/* PDF Document Preview Canvas */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', backgroundColor: '#0b141a' }}>
        
        <div style={{ backgroundColor: '#202c33', padding: '24px', borderRadius: '12px', border: '1px solid #2a3942', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #2a3942', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#00A884' }}>PHONEMAIL SECURE DOCUMENT</div>
              <div style={{ fontSize: '11px', color: '#8696a0' }}>Cryptographic Hash: sha256-e3b0c442...</div>
            </div>
            <span style={{ fontSize: '24px' }}>🔒</span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: '600', color: '#e9edef', marginBottom: '12px', textAlign: 'left' }}>
            Official Notice & Verification Certificate
          </div>

          <p style={{ fontSize: '13px', color: '#8696a0', lineHeight: '1.6', marginBottom: '16px', textAlign: 'left' }}>
            This document has been securely fetched through your authenticated email gateway. All signatures have been verified against the official registry keys.
          </p>

          <div style={{ backgroundColor: '#111b21', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#e9edef', fontFamily: 'monospace', textAlign: 'left' }}>
            Status: VERIFIED & AUTHENTICATED<br/>
            Protocol: IMAP / SMTP Secure Tunnel<br/>
            Encryption: RSA-2048 Bit
          </div>
        </div>

      </div>

      {/* Bottom Download / Action Bar */}
      <div style={{ padding: '16px', backgroundColor: '#202c33', borderTop: '1px solid #2a3942', display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => alert('Document downloaded to device storage.')}
          style={{ flex: 1, backgroundColor: '#00A884', color: '#fff', border: 'none', borderRadius: '24px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Download PDF
        </button>
        <button 
          onClick={onBack}
          style={{ backgroundColor: '#2a3942', color: '#e9edef', border: 'none', borderRadius: '24px', padding: '12px 20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

    </div>
  );
}
