import { useState, useEffect } from 'react';

export default function CallScreen({ chat, isVideo, onEndCall }) {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainSecs.toString().padStart(2, '0')}`;
  };

  const chatName = chat ? chat.name : 'Secure Contact';

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#0b141a', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 24px', boxSizing: 'border-box', color: '#e9edef', textAlign: 'center' }}>
      
      {/* Top Header info */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '13px', color: '#8696a0', letterSpacing: '0.5px', marginBottom: '8px' }}>
          🔒 END-TO-END ENCRYPTED PHONEMAIL {isVideo ? 'VIDEO CALL' : 'VOICE CALL'}
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{chatName}</div>
        <div style={{ fontSize: '14px', color: callDuration > 0 ? '#00A884' : '#8696a0' }}>
          {callDuration > 0 ? formatDuration(callDuration) : 'Ringing securely over IMAP...'}
        </div>
      </div>

      {/* Center Video/Avatar Placeholder */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#202c33', border: '3px solid #00A884', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '48px', fontWeight: 'bold', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {chatName[0]}
        </div>
      </div>

      {/* Call Actions Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#202c33', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '20px' }} title="Mute">
          🎙️
        </div>
        
        {/* End Call Button */}
        <div 
          onClick={onEndCall}
          style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ea0038', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '28px', boxShadow: '0 4px 12px rgba(234,0,56,0.4)' }}
          title="End Call"
        >
          📞
        </div>

        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#202c33', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '20px' }} title="Speaker">
          🔊
        </div>
      </div>

    </div>
  );
}
