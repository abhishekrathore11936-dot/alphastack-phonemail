import { useState } from 'react';

export default function PhoneVerification({ onNext }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '18px 16px', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
        Enter your phone number
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontSize: '14px', color: '#3b4a54', textAlign: 'center', marginBottom: '24px', lineHeight: '1.5' }}>
          PhoneMail will verify your phone number. Auto-detected number is shown below; you can edit it if needed:
        </p>

        {/* Input fields container */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Country Selection Row */}
          <div style={{ borderBottom: '2px solid #00A884', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', color: '#111' }}>India</span>
            <span style={{ fontSize: '16px', color: '#00A884', fontWeight: 'bold' }}>▼</span>
          </div>

          {/* Phone Number Input Row */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ borderBottom: '2px solid #00A884', paddingBottom: '8px', width: '60px' }}>
              <input 
                type="text" 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)} 
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#111', backgroundColor: 'transparent' }} 
              />
            </div>
            <div style={{ borderBottom: '2px solid #00A884', paddingBottom: '8px', flex: 1 }}>
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="phone number"
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '18px', color: '#111', backgroundColor: 'transparent', letterSpacing: '1px' }} 
              />
            </div>
          </div>

        </div>

        <div style={{ fontSize: '13px', color: '#667781', marginTop: '16px', textAlign: 'center' }}>
          Carrier charges may apply
        </div>
      </div>

      {/* Footer Button Area */}
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #f0f2f5' }}>
        <button 
          onClick={() => {
            const cleanCode = countryCode.trim();
            const cleanNum = phoneNumber.trim();
            onNext(`${cleanCode} ${cleanNum}`);
          }}
          style={{ backgroundColor: '#00A884', color: 'white', border: 'none', borderRadius: '24px', padding: '12px 36px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}