import React from 'react';

export default function StarredMessages({ chats, darkMode, onBack, onSelectChat }) {
  const starredItems = [];

  chats.forEach(chat => {
    if (chat.messages && Array.isArray(chat.messages)) {
      chat.messages.forEach(msg => {
        if (msg.starred) {
          starredItems.push({
            id: msg.id,
            chat: chat,
            chatName: chat.name || chat.recipient || 'Chat',
            text: msg.text || msg.snippet || msg.body || '',
            subject: msg.subject || chat.subject || '',
            time: msg.time || chat.time || 'Just now',
          });
        }
      });
    }
  });

  const bgApp = darkMode ? '#111b21' : '#f0f2f5';
  const headerBg = '#075E54';
  const cardBg = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subColor = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e2e8f0';

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgApp, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ backgroundColor: headerBg, color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Starred Messages</div>
      </div>

      {/* Flat List of Separate Individual Message Tiles */}
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {starredItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: subColor, marginTop: '60px', fontSize: '14px' }}>
            ⭐ No starred messages yet.<br/>Star important messages to find them here easily.
          </div>
        ) : (
          starredItems.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => onSelectChat(item.chat, item.id)}
              style={{
                backgroundColor: cardBg,
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00A884' }}>{item.chatName}</span>
                <span style={{ fontSize: '10px', color: subColor }}>{item.time}</span>
              </div>
              {item.subject && (
                <div style={{ fontSize: '11px', fontWeight: '600', color: textColor }}>
                  Subject: {item.subject}
                </div>
              )}
              <div style={{ fontSize: '14px', color: textColor, wordBreak: 'break-word' }}>
                {item.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}