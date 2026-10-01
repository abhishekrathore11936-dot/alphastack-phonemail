import { useState, useEffect } from 'react';

export default function ChatThread({ chat, highlightedMsgId, onBack, onOpenProfile, onStartCall, onOpenAttachment, darkMode, onSendMessage, onUpdateMessages }) {
  const [messages, setMessages] = useState(() => {
    if (chat && Array.isArray(chat.messages) && chat.messages.length > 0) {
      return chat.messages.map((m, idx) => ({
        id: m?.id || `msg_${idx}`,
        sender: m?.sender || (chat?.tag === 'Drafts' ? 'me' : 'other'),
        text: m?.snippet || m?.body || m?.text || '',
        subject: m?.subject || chat?.subject || '',
        time: m?.time || 'Just now',
        starred: m?.starred || false
      }));
    }
    return [
      { 
        id: chat?.id || 1, 
        sender: chat?.tag === 'Drafts' ? 'me' : 'other', 
        text: chat?.snippet || chat?.name || 'Hello', 
        subject: chat?.subject || `${chat?.name || 'Notification'} Inquiry`, 
        time: chat?.time || '08:55 AM', 
        starred: false 
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [inputSubject, setInputSubject] = useState(chat?.subject || '');
  const [prevChatId, setPrevChatId] = useState(chat?.id);
  const [keepSubject, setKeepSubject] = useState(true);
  const [showSubjectInput, setShowSubjectInput] = useState(false);
  const [showEmailHeader, setShowEmailHeader] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  
  const [forwardingMsgText, setForwardingMsgText] = useState(null);
  const [forwardRecipient, setForwardRecipient] = useState('');
  const [forwardSubject, setForwardSubject] = useState('');

  useEffect(() => {
    if (highlightedMsgId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`msg-${highlightedMsgId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [highlightedMsgId]);

  useEffect(() => {
    if (chat && Array.isArray(chat.messages) && chat.messages.length > 0) {
      setMessages(chat.messages.map((m, idx) => ({
        id: m?.id || `msg_${idx}`,
        sender: m?.sender || (chat?.tag === 'Drafts' ? 'me' : 'other'),
        text: m?.snippet || m?.body || m?.text || '',
        subject: m?.subject || chat?.subject || '',
        time: m?.time || 'Just now',
        starred: m?.starred || false
      })));
    } else if (chat) {
      setMessages([
        { 
          id: chat?.id || 1, 
          sender: chat?.tag === 'Drafts' ? 'me' : 'other', 
          text: chat?.snippet || chat?.name || 'Hello', 
          subject: chat?.subject || `${chat?.name} Inquiry`, 
          time: chat?.time || 'Just now', 
          starred: false 
        }
      ]);
    }
    
    if (chat?.id !== prevChatId) {
      setInputSubject(chat?.subject || '');
      setPrevChatId(chat?.id);
    }
  }, [chat, prevChatId]);

  const bgChat = darkMode ? '#0b141a' : '#efeae2';
  const bubbleIncoming = darkMode ? '#202c33' : '#ffffff';
  const bubbleOutgoing = darkMode ? '#005c4b' : '#d9fdd3';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const timeColor = darkMode ? '#8696a0' : '#667781';
  const inputBarBg = darkMode ? '#202c33' : '#f0f2f5';
  const inputBg = darkMode ? '#2a3942' : '#ffffff';
  const bannerBg = darkMode ? '#1f2c34' : '#f8fafc';
  const bannerBorder = darkMode ? '#2a3942' : '#e2e8f0';
  const bannerText = darkMode ? '#8696a0' : '#334155';
  const chipBg = darkMode ? '#2a3942' : '#ffffff';
  const chipText = darkMode ? '#e9edef' : '#334155';
  const chipBorder = darkMode ? '#374248' : '#cbd5e1';

  const chatName = chat?.name || 'Chat';
  const senderEmail = chat?.recipient || `${chatName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'support'}@phonemail.com`;
  
  const activeSubject = inputSubject.trim() || chat?.subject;
  const subjectLine = activeSubject 
    ? `Regarding: ${activeSubject}` 
    : chat 
    ? `Regarding: ${chatName} Inquiry & Verification` 
    : 'General Notice';

  const smartReplies = chatName === 'PM-Kisan' 
    ? ['✅ Confirm Beneficiary Details', '📊 Request Payment Status', '❌ Update Aadhaar Link']
    : chatName === 'High Court Registry' 
    ? ['📅 Request Hearing Extension', '📄 Acknowledge Notice Receipt', '⚖ Request Case Copy']
    : ['✅ Acknowledge & Confirm', '📎 Request Additional Info', '📞 Request Callback'];

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}:${remainSecs.toString().padStart(2, '0')}`;
  };

  const handleSend = (textToSend = inputText, recipientOverride = null, subjectOverride = null) => {
    const safeText = (textToSend || '').toString();
    if (!safeText.trim()) return;

    const currentSubject = subjectOverride || inputSubject.trim();
    const targetRecipient = recipientOverride || chat?.recipient || chatName;
    const currentChatKey = (chat?.recipient || chat?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetKey = (targetRecipient || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const isDifferentRecipient = recipientOverride && targetKey !== currentChatKey;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: safeText,
      subject: currentSubject,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      starred: false
    };

    if (!isDifferentRecipient) {
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
    }
    
    setInputText('');

    if (!keepSubject) {
      setInputSubject('');
    }

    if (onSendMessage) {
      onSendMessage({ 
        text: safeText, 
        subject: currentSubject, 
        recipient: targetRecipient,
        keepSubject: keepSubject,
        messages: isDifferentRecipient ? [newMsg] : [...messages, newMsg]
      });
    }

    if (isDifferentRecipient) {
      alert(`Message successfully sent to ${targetRecipient}!`);
    }
  };

  const handleAttachFile = () => {
    const hasStoragePermission = localStorage.getItem('phonemail_storage_permission') === 'granted';
    if (!hasStoragePermission) {
      const granted = window.confirm("PhoneMail requires permission to access device storage to attach documents and files. Allow access?");
      if (granted) {
        localStorage.setItem('phonemail_storage_permission', 'granted');
      } else {
        alert("Storage permission denied. Cannot attach files.");
        return;
      }
    }

    const fileName = prompt("Enter file or document name to attach (e.g. document.pdf, report.docx):");
    if (!fileName || !fileName.trim()) return;
    const attachText = `📎 [${fileName.trim()}] Please find the attached document for review.`;
    handleSend(attachText);
  };

  const handleSendVoiceNote = () => {
    const timeStr = formatTime(recordingSeconds);
    handleSend(`🎵 [Voice Mail Audio Attachment] (${timeStr})`);
    setIsRecording(false);
  };

  const handleMessageClick = (text) => {
    if (text.includes('📎') && onOpenAttachment) {
      const match = text.match(/\[(.*?)\]/);
      const fileName = match ? match[1] : 'Document.pdf';
      onOpenAttachment(fileName);
    }
  };

  const toggleStarMessage = (msgId) => {
    const updated = messages.map(m => m?.id === msgId ? { ...m, starred: !m.starred } : m);
    setMessages(updated);
    setActiveMenuMsgId(null);
    if (onUpdateMessages) onUpdateMessages(updated);
  };

  const deleteMessage = (msgId) => {
    const updated = messages.filter(m => m?.id !== msgId);
    setMessages(updated);
    setActiveMenuMsgId(null);
    if (onUpdateMessages) onUpdateMessages(updated);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setActiveMenuMsgId(null);
  };

  const openForwardModal = (msgText) => {
    setActiveMenuMsgId(null);
    setForwardingMsgText(msgText);
    setForwardRecipient('');
    setForwardSubject(inputSubject.trim() || chat?.subject || 'Forwarded Mail Note');
  };

  const submitForward = () => {
    if (!forwardRecipient.trim()) {
      alert('Please enter a recipient phone number, email ID, or contact name.');
      return;
    }
    if (!forwardSubject.trim()) {
      alert('Subject is mandatory for every mail.');
      return;
    }

    const textToForward = `[Forwarded] ${forwardingMsgText}`;
    handleSend(textToForward, forwardRecipient.trim(), forwardSubject.trim());
    setForwardingMsgText(null);
  };

  const DropdownChevron = ({ isOpen }) => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      style={{ 
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
        transition: 'transform 0.2s ease',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div 
      onClick={() => setActiveMenuMsgId(null)}
      style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgChat, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' }}
    >
      <style>{`
        @keyframes blinkFlash {
          0% { background-color: #00A884; transform: scale(1.03); box-shadow: 0 0 15px rgba(0,168,132,0.8); }
          50% { opacity: 0.5; transform: scale(1); }
          100% { background-color: inherit; transform: scale(1); box-shadow: none; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px', padding: '4px' }}>←</span>
          
          <div onClick={onOpenProfile} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#00A884', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>
              {chat?.tag === 'Drafts' ? '📝' : (chatName[0] || 'P')}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>{chatName}</div>
              <div style={{ fontSize: '11px', color: '#e9edef', textAlign: 'left' }}>tap for info</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div onClick={() => onStartCall(true)} style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Video Call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </div>
          <div onClick={() => onStartCall(false)} style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Audio Call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Email Thread Metadata Banner */}
      <div style={{ backgroundColor: bannerBg, padding: '10px 16px', borderBottom: `1px solid ${bannerBorder}`, fontSize: '12px', color: bannerText, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', color: '#00A884' }}>📧 EMAIL THREAD CONVERSION</span>
          <span onClick={() => setShowEmailHeader(!showEmailHeader)} style={{ color: '#00A884', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {showEmailHeader ? 'Hide Header' : 'Show Header'} <DropdownChevron isOpen={showEmailHeader} />
          </span>
        </div>
        <div style={{ fontWeight: '600', color: textColor, marginBottom: '2px', textAlign: 'left' }}>{subjectLine}</div>
        {showEmailHeader && (
          <div style={{ fontSize: '11px', color: bannerText, marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            <div><strong>From:</strong> {senderEmail}</div>
            <div><strong>To:</strong> +919876543210@phonemail.com</div>
            <div><strong>Protocol:</strong> End-to-End Encrypted PhoneMail Gateway</div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => {
          const isAttachment = (msg?.text || '').includes('📎');
          const isAudio = (msg?.text || '').includes('🎵');
          const isHighlighted = String(msg?.id) === String(highlightedMsgId);
          const isMenuOpen = activeMenuMsgId === msg?.id;
          
          return (
            <div 
              key={msg?.id || Math.random()}
              id={`msg-${msg?.id}`}
              style={{ 
                alignSelf: msg?.sender === 'me' ? 'flex-end' : 'flex-start',
                backgroundColor: msg?.sender === 'me' ? bubbleOutgoing : bubbleIncoming,
                color: textColor,
                padding: '8px 12px 8px 14px',
                borderRadius: '8px',
                maxWidth: '78%',
                boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                position: 'relative',
                textAlign: 'left',
                animation: isHighlighted ? 'blinkFlash 0.8s ease-in-out 2' : 'none',
                border: isHighlighted ? '2px solid #00A884' : 'none'
              }}
            >
              <div style={{ position: 'absolute', top: '4px', right: '4px' }} onClick={(e) => e.stopPropagation()}>
                <span 
                  onClick={() => setActiveMenuMsgId(isMenuOpen ? null : msg?.id)}
                  style={{ cursor: 'pointer', fontSize: '12px', color: timeColor, padding: '2px 6px', borderRadius: '4px', backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)', display: 'inline-flex', alignItems: 'center' }}
                  title="Message options"
                >
                  <DropdownChevron isOpen={isMenuOpen} />
                </span>

                {isMenuOpen && (
                  <div style={{ position: 'absolute', right: '0', top: '22px', backgroundColor: darkMode ? '#222d34' : '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', border: `1px solid ${darkMode ? '#374248' : '#e2e8f0'}`, borderRadius: '12px', zIndex: 20, padding: '6px', width: '150px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div 
                      onClick={() => toggleStarMessage(msg?.id)}
                      style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>{msg?.starred ? '⭐ Unstar' : '⭐ Star'}</span>
                    </div>
                    <div 
                      onClick={() => copyMessage(msg?.text)}
                      style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>📋 Copy</span>
                    </div>
                    <div 
                      onClick={() => openForwardModal(msg?.text)}
                      style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>📤 Forward</span>
                    </div>
                    <div 
                      onClick={() => deleteMessage(msg?.id)}
                      style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: '#df3333', borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>🗑️ Delete</span>
                    </div>
                  </div>
                )}
              </div>

              {msg?.subject && (
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00A884', marginBottom: '2px', marginRight: '16px' }}>
                  Subject: {msg.subject}
                </div>
              )}
              
              <div 
                onClick={() => handleMessageClick(msg?.text)}
                style={{ fontSize: '14px', color: textColor, wordBreak: 'break-word', marginBottom: '4px', marginRight: '18px', cursor: isAttachment ? 'pointer' : 'default', textAlign: 'left' }}
              >
                {msg?.text}
              </div>

              {isAttachment && (
                <div style={{ fontSize: '11px', color: darkMode ? '#53bdeb' : '#00A884', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'left' }}>
                  <span>🔍 Tap to view document preview</span>
                </div>
              )}
              {isAudio && (
                <div style={{ fontSize: '11px', color: darkMode ? '#53bdeb' : '#075E54', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'left' }}>
                  <span>▶ Play Audio Mail</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                {msg?.starred && <span style={{ fontSize: '10px' }}>⭐</span>}
                <div style={{ fontSize: '10px', color: timeColor, textAlign: 'right' }}>{msg?.time || 'Just now'}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forward Modal Overlay */}
      {forwardingMsgText && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: darkMode ? '#222d34' : '#ffffff', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '340px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: textColor }}>📤 Forward Message</div>
            
            <div style={{ fontSize: '12px', color: timeColor, backgroundColor: darkMode ? '#111b21' : '#f0f2f5', padding: '8px', borderRadius: '8px', maxHeight: '60px', overflowY: 'auto' }}>
              "{forwardingMsgText}"
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#00A884', display: 'block', marginBottom: '4px' }}>TO (RECIPIENT PHONE, EMAIL, OR NAME)</label>
              <input 
                type="text"
                autoFocus
                value={forwardRecipient}
                onChange={(e) => setForwardRecipient(e.target.value)}
                placeholder="+919876543210 or email ID..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${chipBorder}`, backgroundColor: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#00A884', display: 'block', marginBottom: '4px' }}>SUBJECT (REQUIRED)</label>
              <input 
                type="text"
                value={forwardSubject}
                onChange={(e) => setForwardSubject(e.target.value)}
                placeholder="Enter mail subject..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${chipBorder}`, backgroundColor: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button 
                onClick={() => setForwardingMsgText(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${chipBorder}`, backgroundColor: 'transparent', color: textColor, fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={submitForward}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#00A884', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Smart Reply Chips Bar */}
      <div style={{ padding: '6px 12px', backgroundColor: inputBarBg, display: 'flex', gap: '6px', overflowX: 'auto', borderTop: `1px solid ${bannerBorder}` }}>
        <span style={{ fontSize: '11px', color: '#00A884', fontWeight: 'bold', alignSelf: 'center', whiteSpace: 'nowrap' }}>✨ AI Reply:</span>
        {smartReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(reply)}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: `1px solid ${chipBorder}`,
              backgroundColor: chipBg,
              color: chipText,
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Bottom Input Area */}
      <div style={{ backgroundColor: inputBarBg, borderTop: `1px solid ${bannerBorder}` }}>
        <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: showSubjectInput ? `1px solid ${bannerBorder}` : 'none' }}>
          <span 
            onClick={() => setShowSubjectInput(!showSubjectInput)}
            style={{ fontSize: '12px', color: '#00A884', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {showSubjectInput ? 'Hide Subject Field' : 'Add / Edit Subject'} <DropdownChevron isOpen={showSubjectInput} />
          </span>
        </div>

        {showSubjectInput && (
          <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: `1px solid ${bannerBorder}` }}>
            <input 
              type="text"
              value={inputSubject}
              onChange={(e) => setInputSubject(e.target.value)}
              placeholder="Enter message subject..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${chipBorder}`, backgroundColor: inputBg, color: textColor, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: textColor, cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox"
                checked={keepSubject}
                onChange={(e) => {
                  const val = e.target.checked;
                  setKeepSubject(val);
                  if (!val) {
                    const recipientKey = chat?.recipient || chatName;
                    if (recipientKey) {
                      const savedSubjects = JSON.parse(localStorage.getItem('phonemail_recipient_subjects') || '{}');
                      if (savedSubjects[recipientKey]) {
                        delete savedSubjects[recipientKey];
                        localStorage.setItem('phonemail_recipient_subjects', JSON.stringify(savedSubjects));
                      }
                    }
                  }
                }}
                style={{ cursor: 'pointer', accentColor: '#00A884' }}
              />
              <span>Remember subject for future messages to this chat</span>
            </label>
          </div>
        )}

        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isRecording ? (
            <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: inputBg, padding: '10px 16px', borderRadius: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#df3333', fontWeight: 'bold', fontSize: '14px' }}>
                <span>🔴</span>
                <span>Recording Voice Mail... {formatTime(recordingSeconds)}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span onClick={() => setIsRecording(false)} style={{ cursor: 'pointer', fontSize: '16px', color: timeColor }}>❌</span>
                <span onClick={handleSendVoiceNote} style={{ cursor: 'pointer', fontSize: '18px', color: '#00A884', fontWeight: 'bold' }}>✓</span>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={handleAttachFile}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Attach Document / File"
              >
                📎
              </button>

              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Reply as email / chat..." 
                style={{ flex: 1, padding: '10px 14px', borderRadius: '24px', border: 'none', outline: 'none', fontSize: '14px', backgroundColor: inputBg, color: textColor, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              />

              {inputText.trim() ? (
                <button 
                  onClick={() => handleSend(inputText)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#00A884', color: '#fff', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                  title="Send Message"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              ) : (
                <button 
                  onClick={() => setIsRecording(true)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#00A884', color: '#fff', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                  title="Record Voice Note"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}