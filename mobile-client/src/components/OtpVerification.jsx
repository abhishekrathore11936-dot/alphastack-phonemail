import { useState, useRef } from 'react';

export default function OtpVerification({ onNext, phoneNumber }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    // Take only the last typed character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Automatically shift focus to the next input box if a digit was entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to the previous input on Backspace if the current box is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '18px 16px', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
        Verifying your number
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#3b4a54', marginBottom: '8px', lineHeight: '1.5' }}>
          Waiting to automatically detect an SMS sent to your number.
        </p>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', marginBottom: '24px' }}>
          {phoneNumber || '+91 98765 43210'} 
          <span style={{ color: '#00A884', cursor: 'pointer', fontWeight: 'normal', fontSize: '13px', marginLeft: '6px' }}>Wrong number?</span>
        </span>

        {/* OTP Input Boxes */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: '40px',
                height: '45px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                borderBottom: '2px solid #00A884',
                outline: 'none',
                backgroundColor: '#f0f2f5',
                borderRadius: '4px 4px 0 0'
              }}
            />
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#667781', marginBottom: '20px' }}>
          Enter 6-digit code
        </p>

        <div style={{ color: '#00A884', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
          Resend SMS
        </div>
      </div>

      {/* Footer Button Area */}
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #f0f2f5' }}>
        <button 
          onClick={onNext}
          style={{ backgroundColor: '#00A884', color: 'white', border: 'none', borderRadius: '24px', padding: '12px 36px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' }}
        >
          VERIFY
        </button>
      </div>
    </div>
  );
}