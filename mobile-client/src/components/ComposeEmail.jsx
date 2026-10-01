import { useState, useEffect } from 'react';

// Safe localStorage helper to prevent security errors in restricted browser environments
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

export default function ComposeEmail({ onBack, darkMode, onSendMessage, onSaveDraft }) {
  const [recipient, setRecipient] = useState(() => {
    try {
      const saved = safeStorage.getItem('phonemail_temp_draft');
      return saved ? JSON.parse(saved)?.recipient || '' : '';
    } catch (e) {
      return '';
    }
  });

  const [subject, setSubject] = useState(() => {
    try {
      const saved = safeStorage.getItem('phonemail_temp_draft');
      return saved ? JSON.parse(saved)?.subject || '' : '';
    } catch (e) {
      return '';
    }
  });

  const [snippet, setSnippet] = useState(() => {
    try {
      const saved = safeStorage.getItem('phonemail_temp_draft');
      return saved ? JSON.parse(saved)?.snippet || '' : '';
    } catch (e) {
      return '';
    }
  });

  const [attachedFile, setAttachedFile] = useState(() => {
    try {
      const saved = safeStorage.getItem('phonemail_temp_draft');
      return saved ? JSON.parse(saved)?.attachedFile || null : null;
    } catch (e) {
      return null;
    }
  });

  const [keepSubject, setKeepSubject] = useState(true);

  // Auto-save compose state safely as user types
  useEffect(() => {
    safeStorage.setItem('phonemail_temp_draft', JSON.stringify({ recipient, subject, snippet, attachedFile }));
  }, [recipient, subject, snippet, attachedFile]);

  // Auto-fill subject if saved for recipient
  useEffect(() => {
    if (recipient && recipient.trim()) {
      try {
        const savedSubjects = JSON.parse(safeStorage.getItem('phonemail_recipient_subjects') || '{}');
        if (savedSubjects[recipient.trim()]) {
          setSubject(savedSubjects[recipient.trim()]);
        }
      } catch (e) {}
    }
  }, [recipient]);

  const handleSmartPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        alert('Clipboard is empty.');
        return;
      }

      let detectedSubject = '';
      let detectedMessage = text;

      const subjectMatch = text.match(/Subject[:\-]\s*(.*?)(\n|$)/i);
      if (subjectMatch && subjectMatch[1]) {
        detectedSubject = subjectMatch[1].trim();
        detectedMessage = text.replace(subjectMatch[0], '').trim();
      }

      if (detectedSubject) setSubject(detectedSubject);
      if (detectedMessage) setSnippet(detectedMessage);
    } catch (err) {
      alert('Unable to paste from clipboard. Please check browser permissions.');
    }
  };

  const handleAttach = () => {
    try {
      const hasStoragePermission = safeStorage.getItem('phonemail_storage_permission') === 'granted';
      if (!hasStoragePermission) {
        const granted = window.confirm("PhoneMail requires permission to access device storage to attach documents and files. Allow access?");
        if (granted) {
          safeStorage.setItem('phonemail_storage_permission', 'granted');
        } else {
          alert("Storage permission denied. Cannot attach files.");
          return;
        }
      }

      const fileName = prompt("Enter file name to attach (e.g. application_form.pdf):");
      if (fileName && fileName.trim()) {
        setAttachedFile(fileName.trim());
      }
    } catch (e) {
      const fileName = prompt("Enter file name to attach (e.g. document.pdf):");
      if (fileName && fileName.trim()) {
        setAttachedFile(fileName.trim());
      }
    }
  };

  const handleClose = () => {
    if (((subject || '').trim() || (snippet || '').trim() || attachedFile) && onSaveDraft) {
      let finalSnippet = (snippet || '').trim();
      if (attachedFile) {
        finalSnippet = `📎 [${attachedFile}] ${finalSnippet}`.trim();
      }
      onSaveDraft({ 
        recipient: (recipient || '').trim(), 
        subject: (subject || '').trim(), 
        snippet: finalSnippet 
      });
    }
    safeStorage.removeItem('phonemail_temp_draft');
    if (onBack) onBack();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const safeSubject = (subject || '').trim();
    const safeSnippet = (snippet || '').trim();

    if (!safeSubject) {
      alert('Subject is mandatory for every mail.');
      return;
    }
    if (!safeSnippet && !attachedFile) {
      alert('Message body cannot be empty.');
      return;
    }

    safeStorage.removeItem('phonemail_temp_draft');

    let finalSnippet = safeSnippet;
    if (attachedFile) {
      finalSnippet = `📎 [${attachedFile}] ${finalSnippet}`.trim();
    }

    if (onSendMessage) {
      onSendMessage({
        recipient: (recipient || '').trim(),
        subject: safeSubject,
        snippet: finalSnippet,
        keepSubject
      });
    }
  };

  const bgPrimary = darkMode ? '#111b21' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const inputBg = darkMode ? '#2a3942' : '#f0f2f5';
  const borderColor = darkMode ? '#2a3942' : '#d1d7db';

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: bgPrimary, height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span onClick={handleClose} style={{ cursor: 'pointer', fontSize: '20px' }}>←</span>
        <span style={{ fontSize: '18px', fontWeight: '600' }}>New Email / Message</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        
        <button 
          type="button"
          onClick={handleSmartPaste}
          style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: '#00A884', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <span>📋 Smart Paste (Auto-detect Subject & Message)</span>
        </button>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#00A884', display: 'block', marginBottom: '6px' }}>TO (RECIPIENT PHONE OR EMAIL ID)</label>
          <input 
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Leave blank for Saved Messages (Self)"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#00A884', display: 'block', marginBottom: '6px' }}>SUBJECT (REQUIRED)</label>
          <input 
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter mail subject..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {recipient && recipient.trim() && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: textColor, cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={keepSubject}
              onChange={(e) => setKeepSubject(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#00A884' }}
            />
            <span>Remember subject for future messages to this recipient</span>
          </label>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#00A884', display: 'block', marginBottom: '6px' }}>MESSAGE / EMAIL BODY</label>
          <textarea 
            value={snippet}
            onChange={(e) => setSnippet(e.target.value)}
            placeholder="Type your message here..."
            style={{ width: '100%', flex: 1, minHeight: '150px', padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: inputBg, color: textColor, fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        {/* Attach File Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: inputBg, padding: '10px 14px', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '13px', color: textColor, display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span>📎</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attachedFile ? attachedFile : 'No attachment selected'}</span>
          </div>
          <button 
            type="button"
            onClick={handleAttach}
            style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#00A884', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', flexShrink: '0' }}
          >
            {attachedFile ? 'Change File' : 'Attach File'}
          </button>
        </div>

        <button 
          type="submit"
          style={{ padding: '14px', borderRadius: '24px', border: 'none', backgroundColor: '#00A884', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
        >
          Send Mail
        </button>

      </form>

    </div>
  );
}