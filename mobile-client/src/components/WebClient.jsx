import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

export default function WebClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: Inbox

  const [chats, setChats] = useState([]);
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);

  // Compose state
  const [toField, setToField] = useState('');
  const [subjectField, setSubjectField] = useState('');
  const [bodyField, setBodyField] = useState('');

  useEffect(() => {
    const savedPhone = localStorage.getItem('phonemail_web_phone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setIsLoggedIn(true);
      setStep(2);
      socket.emit('register_user', savedPhone);
    }
  }, []);

  useEffect(() => {
    socket.on('load_chats', (serverChats) => {
      setChats(serverChats);
    });

    return () => {
      socket.off('load_chats');
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    // Simulate OTP verification step
    if (step === 1) {
      setStep(1.5); // Enter OTP
    } else {
      localStorage.setItem('phonemail_web_phone', phoneNumber);
      setIsLoggedIn(true);
      setStep(2);
      socket.emit('register_user', phoneNumber);
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!subjectField.trim()) {
      alert('Subject is mandatory for every mail.');
      return;
    }
    if (!toField.trim()) {
      alert('Please specify a recipient.');
      return;
    }

    const messageObj = {
      id: Date.now(),
      snippet: bodyField,
      body: bodyField,
      text: bodyField,
      subject: subjectField,
      time: 'Just now',
      sender: 'me',
      starred: false
    };

    socket.emit('send_message', {
      senderPhone: phoneNumber,
      recipientIdentifier: toField.trim(),
      messageObj: messageObj,
      subject: subjectField.trim()
    });

    setIsComposing(false);
    setToField('');
    setSubjectField('');
    setBodyField('');
  };

  // Filter emails based on active folder
  const filteredChats = chats.filter(chat => {
    if (activeFolder === 'Inbox') return chat.tag !== 'Drafts' && chat.tag !== 'Trash';
    if (activeFolder === 'Unread') return chat.unread > 0;
    if (activeFolder === 'Favourites') return chat.favourite || chat.tag === 'Favourites';
    if (activeFolder === 'Drafts') return chat.tag === 'Drafts';
    return true;
  });

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f6f8fc', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <h2 style={{ color: '#1f1f1f', marginBottom: '8px' }}>PhoneMail Web</h2>
          <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '24px' }}>Sign in using your phone number ID</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#5f6368', display: 'block', marginBottom: '6px' }}>PHONE NUMBER</label>
              <input 
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {step === 1.5 && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#5f6368', display: 'block', marginBottom: '6px' }}>ENTER OTP</label>
                <input 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <button 
              type="submit"
              onClick={() => { if(step === 1) setStep(1.5); }}
              style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#0b57d0', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
            >
              {step === 1 ? 'Next' : 'Verify & Sign In'}
            </button>

            <p style={{ fontSize: '11px', color: '#70757a', textAlign: 'center', marginTop: '12px' }}>
              By signing up, you agree to the <span style={{ color: '#0b57d0', cursor: 'pointer' }}>Terms of Service</span>.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f6f8fc', fontFamily: 'Arial, sans-serif', color: '#3c4043', overflow: 'hidden' }}>
      
      {/* Gmail Left Sidebar */}
      <div style={{ width: '256px', backgroundColor: '#f6f8fc', padding: '12px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '20px' }}>📧</span>
          <span style={{ fontSize: '18px', fontWeight: '500', color: '#202124' }}>PhoneMail Web</span>
        </div>

        <button 
          onClick={() => setIsComposing(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#c2e7ff', color: '#001d35', padding: '12px 24px', borderRadius: '24px', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <span>✏️</span> Compose
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {['Inbox', 'Unread', 'Favourites', 'Drafts'].map((folder) => (
            <div 
              key={folder}
              onClick={() => { setActiveFolder(folder); setSelectedEmail(null); }}
              style={{ 
                padding: '10px 16px', 
                borderRadius: '0 20px 20px 0', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: activeFolder === folder ? 'bold' : 'normal',
                backgroundColor: activeFolder === folder ? '#d3e3fd' : 'transparent',
                color: activeFolder === folder ? '#041e49' : '#3c4043',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{folder === 'Inbox' ? '📥 ' : folder === 'Unread' ? '📩 ' : folder === 'Favourites' ? '⭐ ' : '📝 '}{folder}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', margin: '8px 8px 8px 0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Top Header / Search */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input 
            type="text"
            placeholder="Search mail..."
            style={{ width: '400px', padding: '10px 16px', borderRadius: '24px', border: 'none', backgroundColor: '#f1f3f4', fontSize: '14px', outline: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#5f6368' }}>{phoneNumber}</span>
            <button 
              onClick={() => { localStorage.removeItem('phonemail_web_phone'); setIsLoggedIn(false); }}
              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: '1px solid #dadce0', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Split View: Email Table list or Email Detail reading pane */}
        {selectedEmail ? (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <button 
              onClick={() => setSelectedEmail(null)}
              style={{ marginBottom: '16px', padding: '6px 14px', borderRadius: '4px', border: '1px solid #dadce0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' }}
            >
              ← Back to {activeFolder}
            </button>

            <h2 style={{ marginBottom: '8px', color: '#202124' }}>{selectedEmail.subject || selectedEmail.name || 'Conversation'}</h2>
            <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
              From: <strong>{selectedEmail.name}</strong> ({selectedEmail.recipient || 'external@phonemail.com'})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(selectedEmail.messages || [{ text: selectedEmail.snippet, time: selectedEmail.time, sender: 'other' }]).map((msg, idx) => (
                <div key={idx} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: msg.sender === 'me' ? '#f1f3f4' : '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <div style={{ fontSize: '11px', color: '#70757a', marginBottom: '4px' }}>{msg.time || 'Just now'}</div>
                  <div style={{ fontSize: '14px', color: '#202124' }}>{msg.text || msg.snippet}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredChats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#5f6368' }}>No messages found in {activeFolder}.</div>
            ) : (
              filteredChats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedEmail(chat)}
                  style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid #f1f3f4', cursor: 'pointer', backgroundColor: chat.unread ? '#f2f6fc' : '#fff', '&:hover': { boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' } }}
                >
                  <div style={{ width: '180px', fontWeight: chat.unread ? 'bold' : 'normal', color: '#202124', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.name}
                  </div>
                  <div style={{ flex: 1, fontSize: '14px', color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: chat.unread ? 'bold' : 'normal' }}>{chat.subject || 'Message'}</span>
                    <span style={{ color: '#5f6368' }}>— {chat.snippet}</span>
                  </div>
                  <div style={{ width: '80px', textAlign: 'right', fontSize: '12px', color: '#5f6368' }}>
                    {chat.time}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Gmail-style Compose Modal */}
      {isComposing && (
        <div style={{ position: 'fixed', bottom: 0, right: '40px', width: '500px', backgroundColor: '#fff', borderRadius: '8px 8px 0 0', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid #dadce0', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#404040', color: '#fff', padding: '10px 16px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' }}>
            <span>New Message</span>
            <span onClick={() => setIsComposing(false)} style={{ cursor: 'pointer' }}>✕</span>
          </div>

          <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: '8px' }}>
            <input 
              type="text"
              value={toField}
              onChange={(e) => setToField(e.target.value)}
              placeholder="Recipients (Phone or email ID)"
              style={{ border: 'none', borderBottom: '1px solid #e0e0e0', padding: '8px 0', fontSize: '13px', outline: 'none' }}
            />
            <input 
              type="text"
              value={subjectField}
              onChange={(e) => setSubjectField(e.target.value)}
              placeholder="Subject (Required)"
              style={{ border: 'none', borderBottom: '1px solid #e0e0e0', padding: '8px 0', fontSize: '13px', outline: 'none' }}
            />
            <textarea 
              value={bodyField}
              onChange={(e) => setBodyField(e.target.value)}
              placeholder="Type your message..."
              style={{ border: 'none', minHeight: '120px', padding: '8px 0', fontSize: '13px', outline: 'none', resize: 'none' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button 
                type="submit"
                style={{ padding: '8px 24px', borderRadius: '20px', backgroundColor: '#0b57d0', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}