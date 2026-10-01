import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Onboarding from './components/Onboarding';
import PhoneVerification from './components/PhoneVerification';
import OtpVerification from './components/OtpVerification';
import NotificationPermission from './components/NotificationPermission';
import Inbox from './components/Inbox';
import ChatThread from './components/ChatThread';
import ComposeEmail from './components/ComposeEmail';
import Settings from './components/Settings';
import ChatDetails from './components/ChatDetails';
import CallScreen from './components/CallScreen';
import AttachmentViewer from './components/AttachmentViewer';
import LinkedAccounts from './components/LinkedAccounts';
import StarredMessages from './components/StarredMessages';
import StorageData from './components/StorageData';
import PrivacyScreen from './components/PrivacyScreen';
import HelpSupport from './components/HelpSupport';
import AboutPhoneMail from './components/AboutPhoneMail';
import DisplayLanguage from './components/DisplayLanguage';
import NotificationsChimes from './components/NotificationsChimes';
import WebClient from './components/WebClient';
import { getLocalizedChats } from './utils/translations';

// Connect to the backend server
const socket = io('http://localhost:5001');

// Robust helper to correlate email handles, display names, and phone numbers without duplicates
const findMatchingChatIndex = (chatsList, identifier, activePhone) => {
  if (!identifier || !identifier.trim()) return -2;
  
  const cleanInput = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  const inputHandle = identifier.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanPhone = (activePhone || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (cleanInput === '' || cleanInput === cleanPhone) return -2;

  return chatsList.findIndex(c => {
    const cNameClean = (c.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cRecipientClean = (c.recipient || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cRecipientHandle = (c.recipient || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      cNameClean === cleanInput ||
      cRecipientClean === cleanInput ||
      cNameClean === inputHandle ||
      cRecipientHandle === inputHandle ||
      cRecipientClean.startsWith(`${cleanInput}@`) ||
      cNameClean.startsWith(cleanInput) ||
      cleanInput.startsWith(cNameClean) ||
      cleanInput.startsWith(cRecipientHandle)
    );
  });
};

export default function App() {
  // 1. phoneNumber declared FIRST to prevent initialization reference errors
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem('phonemail_active_phone') || '+91 9876543210';
  });

  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(localStorage.getItem('phonemail_step')) || 2;
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('phonemail_lang') || 'English';
  });

  const [clientMode, setClientMode] = useState('mobile');

  const [activeChat, setActiveChat] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLinkedAccountsOpen, setIsLinkedAccountsOpen] = useState(false);
  const [isStarredOpen, setIsStarredOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [notifIndex, setNotifIndex] = useState(0);
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('phonemail_dark') === 'true';
  });
  
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(`phonemail_chats_${phoneNumber}`);
    let initialChats = saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: 'PM-Kisan', 
        recipient: 'pmkisan@phonemail.com',
        snippet: 'Please check your PM-Kisan beneficiary status and confirm your details.', 
        time: '08:55 AM', 
        unread: 1, 
        tag: 'Favourites',
        favourite: true,
        messages: [
          { id: 101, sender: 'other', text: 'Please check your PM-Kisan beneficiary status and confirm your details.', time: '08:55 AM', starred: false }
        ]
      },
      { 
        id: 2, 
        name: 'High Court Registry', 
        recipient: 'highcourt@phonemail.com',
        snippet: 'Please find the next hearing notice for your case.', 
        time: '09:10 AM', 
        unread: 1, 
        tag: 'Unread',
        messages: [
          { id: 102, sender: 'other', text: 'Please find the next hearing notice for your case.', time: '09:10 AM', starred: false }
        ]
      },
      { 
        id: 3, 
        name: 'Passport Seva', 
        recipient: 'passportseva@phonemail.com',
        snippet: '📎 [passport_update.pdf] Please find attached the latest update on your passport application.', 
        time: '10:00 AM', 
        unread: 1, 
        tag: 'Attachments',
        messages: [
          { id: 103, sender: 'other', text: '📎 [passport_update.pdf] Please find attached the latest update on your passport application.', time: '10:00 AM', starred: false }
        ]
      }
    ];

    const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');
    initialChats = initialChats.filter(c => {
      const cName = (c.name || '').replace(/\s+/g, '');
      const cRecipient = (c.recipient || '').replace(/\s+/g, '');
      const isStrayCard = c.name === 'Automated Alert' || c.snippet === 'New notification received.' || c.name?.includes('Sender') || cName === cleanPhone || cRecipient === cleanPhone;
      return !isStrayCard;
    });

    return initialChats;
  });

  // Socket.io real-time sync listener & registration
  useEffect(() => {
    if (phoneNumber) {
      socket.emit('register_user', phoneNumber);
      
      socket.on('load_chats', (serverChats) => {
        setChats(serverChats);
      });

      socket.on('play_notification_sound', () => {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play();
        } catch (e) {
          console.log("Audio play blocked");
        }
      });
    }

    return () => {
      socket.off('load_chats');
      socket.off('play_notification_sound');
    };
  }, [phoneNumber]);

  const localizedChats = getLocalizedChats(chats, selectedLanguage);

  const triggerLiveSync = () => {
    const liveNotifications = [
      { name: 'Electricity Board (TANGEDCO)', recipient: 'tangedco@phonemail.com', snippet: 'Your monthly bill of ₹1,840 is due on 05-Oct-2026.', tag: 'Unread' },
      { name: 'DigiLocker Security', recipient: 'digilocker@phonemail.com', snippet: '📎 [transcript.pdf] New academic transcript document successfully verified.', tag: 'Attachments' },
      { name: 'Income Tax Dept', recipient: 'incometax@phonemail.com', snippet: 'Your tax refund status for Assessment Year 2025-26 has been updated.', tag: 'Favourites', favourite: true },
      { name: 'NIT Trichy Academic', recipient: 'nitt@phonemail.com', snippet: 'Course registration window for Semester V is now open.', tag: 'Unread' },
      { name: 'Bank Alert (SBI)', recipient: 'sbi@phonemail.com', snippet: 'Your account was credited with INR 15,000.00 via UPI.', tag: 'Unread' }
    ];

    const currentNotif = liveNotifications[notifIndex];
    setNotifIndex((prev) => (prev + 1) % liveNotifications.length);

    const msgId = Date.now();
    const incomingMessage = {
      id: msgId,
      name: currentNotif.name, 
      recipient: currentNotif.recipient,
      snippet: currentNotif.snippet, 
      subject: `${currentNotif.name} Notice`,
      time: 'Just now',
      unread: 1,
      tag: currentNotif.tag,
      favourite: currentNotif.favourite || false,
      messages: [
        { id: msgId, sender: 'other', text: currentNotif.snippet, subject: `${currentNotif.name} Notice`, time: 'Just now', starred: false }
      ]
    };
    
    setChats(prevChats => [incomingMessage, ...prevChats]);
    
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch (e) {
      console.log("Audio play blocked by browser policy");
    }
  };

  const handleSaveDraftOnly = ({ recipient, subject, snippet }) => {
    if (!subject.trim() && !snippet.trim()) return;
    const formattedSnippet = `[Draft] Subject: ${subject || 'No Subject'} - ${snippet || ''}`;
    const messageObj = {
      id: Date.now(),
      snippet: formattedSnippet,
      body: snippet,
      text: snippet,
      subject: subject || 'No Subject',
      time: 'Just now',
      sender: 'me',
      starred: false
    };

    setChats(prevChats => {
      const existingDraftIndex = prevChats.findIndex(c => c.tag === 'Drafts' || c.name?.includes('Drafts'));
      if (existingDraftIndex !== -1) {
        const updated = [...prevChats];
        const target = updated[existingDraftIndex];
        const history = target.messages || [];
        const updatedChat = {
          ...target,
          name: `Drafts (${phoneNumber})`,
          subject: subject || target.subject,
          snippet: formattedSnippet,
          time: 'Just now',
          messages: [...history, messageObj]
        };
        updated.splice(existingDraftIndex, 1);
        updated.unshift(updatedChat);
        return updated;
      } else {
        const newDraftChat = {
          id: Date.now(),
          name: `Drafts (${phoneNumber})`,
          subject: subject || 'No Subject',
          snippet: formattedSnippet,
          time: 'Just now',
          unread: 0,
          tag: 'Drafts',
          messages: [messageObj]
        };
        return [newDraftChat, ...prevChats];
      }
    });
  };

  const handleSelfMessage = ({ text, subject, recipient, messages }) => {
    const currentSubject = subject || 'Self Note';
    const finalMessages = messages && messages.length > 0 
      ? messages 
      : [{ id: Date.now(), sender: 'me', text, subject: currentSubject, time: 'Just now', starred: false }];

    setChats(prevChats => {
      const existingIndex = prevChats.findIndex(c => c.tag === 'Self' || c.name === 'Saved Messages (You)');
      if (existingIndex !== -1) {
        const updated = [...prevChats];
        const target = updated[existingIndex];
        const updatedChat = {
          ...target,
          subject: currentSubject,
          snippet: text,
          time: 'Just now',
          messages: finalMessages
        };
        updated.splice(existingIndex, 1);
        updated.unshift(updatedChat);
        setActiveChat(updatedChat);
        return updated;
      } else {
        const selfChat = {
          id: Date.now(),
          name: 'Saved Messages (You)',
          recipient: phoneNumber,
          subject: currentSubject,
          snippet: text,
          time: 'Just now',
          unread: 0,
          tag: 'Self',
          messages: finalMessages
        };
        setActiveChat(selfChat);
        return [selfChat, ...prevChats];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem('phonemail_step', currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('phonemail_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');
    const filteredChats = chats.filter(c => {
      const cName = (c.name || '').replace(/\s+/g, '');
      const cRecipient = (c.recipient || '').replace(/\s+/g, '');
      return !(c.name === 'Automated Alert' || c.snippet === 'New notification received.' || c.name?.includes('Sender') || (cName === cleanPhone && c.tag !== 'Self') || (cRecipient === cleanPhone && c.tag !== 'Self'));
    });
    localStorage.setItem(`phonemail_chats_${phoneNumber}`, JSON.stringify(filteredChats));
  }, [chats, phoneNumber]);

  useEffect(() => {
    localStorage.setItem('phonemail_lang', selectedLanguage);
  }, [selectedLanguage]);

  return (
    <div style={{ backgroundColor: darkMode ? '#111b21' : '#fff', minHeight: '100vh' }}>
      
      {/* 🚀 Development Client Switcher Bar */}
      <div style={{ backgroundColor: '#202124', color: '#fff', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderBottom: '1px solid #3c4043' }}>
        <span>Alphastack Buildathon | PhoneMail Application</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setClientMode('mobile')} 
            style={{ background: clientMode === 'mobile' ? '#0b57d0' : 'transparent', color: '#fff', border: '1px solid #5f6368', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📱 Mobile Client (WhatsApp)
          </button>
          <button 
            onClick={() => setClientMode('web')} 
            style={{ background: clientMode === 'web' ? '#0b57d0' : 'transparent', color: '#fff', border: '1px solid #5f6368', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            💻 Web Client (Gmail)
          </button>
        </div>
      </div>

      {/* 🖥️ Conditional View Rendering */}
      {clientMode === 'web' ? (
        <WebClient />
      ) : (
        <>
          {currentStep === 1 && (
            <Onboarding 
              onComplete={() => setCurrentStep(2)} 
              selectedLang={selectedLanguage}
              setLang={setSelectedLanguage}
            />
          )}
          
          {currentStep === 2 && (
            <PhoneVerification 
              onNext={(num) => {
                if (num) {
                  setPhoneNumber(num);
                  localStorage.setItem('phonemail_active_phone', num);
                  socket.emit('register_user', num);

                  const existingStorage = localStorage.getItem(`phonemail_chats_${num}`);
                  if (!existingStorage) {
                    const freshDefaults = [
                      { 
                        id: 1, 
                        name: 'PM-Kisan', 
                        recipient: 'pmkisan@phonemail.com',
                        snippet: 'Please check your PM-Kisan beneficiary status and confirm your details.', 
                        time: '08:55 AM', 
                        unread: 1, 
                        tag: 'Favourites',
                        favourite: true,
                        messages: [
                          { id: 101, sender: 'other', text: 'Please check your PM-Kisan beneficiary status and confirm your details.', time: '08:55 AM', starred: false }
                        ]
                      },
                      { 
                        id: 2, 
                        name: 'High Court Registry', 
                        recipient: 'highcourt@phonemail.com',
                        snippet: 'Please find the next hearing notice for your case.', 
                        time: '09:10 AM', 
                        unread: 1, 
                        tag: 'Unread',
                        messages: [
                          { id: 102, sender: 'other', text: 'Please find the next hearing notice for your case.', time: '09:10 AM', starred: false }
                        ]
                      },
                      { 
                        id: 3, 
                        name: 'Passport Seva', 
                        recipient: 'passportseva@phonemail.com',
                        snippet: '📎 [passport_update.pdf] Please find attached the latest update on your passport application.', 
                        time: '10:00 AM', 
                        unread: 1, 
                        tag: 'Attachments',
                        messages: [
                          { id: 103, sender: 'other', text: '📎 [passport_update.pdf] Please find attached the latest update on your passport application.', time: '10:00 AM', starred: false }
                        ]
                      }
                    ];
                    
                    setChats(freshDefaults);
                    localStorage.setItem(`phonemail_chats_${num}`, JSON.stringify(freshDefaults));
                  } else {
                    setChats(JSON.parse(existingStorage));
                  }
                }
                setCurrentStep(3);
              }} 
            />
          )}

          {currentStep === 3 && (
            <OtpVerification phoneNumber={phoneNumber} onNext={() => setCurrentStep(4)} />
          )}

          {currentStep === 4 && (
            <NotificationPermission onNext={() => setCurrentStep(5)} />
          )}

          {currentStep === 5 && isSettingsOpen && (
            <Settings 
              phoneNumber={phoneNumber}
              selectedLang={selectedLanguage}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onBack={() => setIsSettingsOpen(false)}
              onOpenLinkedAccounts={() => { setIsSettingsOpen(false); setIsLinkedAccountsOpen(true); }}
              onOpenStarredMessages={() => { setIsSettingsOpen(false); setIsStarredOpen(true); }}
              onOpenStorage={() => { setIsSettingsOpen(false); setIsStorageOpen(true); }}
              onOpenPrivacy={() => { setIsSettingsOpen(false); setIsPrivacyOpen(true); }}
              onOpenHelp={() => { setIsSettingsOpen(false); setIsHelpOpen(true); }}
              onOpenAbout={() => { setIsSettingsOpen(false); setIsAboutOpen(true); }}
              onOpenNotifications={() => { setIsSettingsOpen(false); setIsNotificationsOpen(true); }}
              onOpenLanguage={() => { setIsSettingsOpen(false); setIsLanguageOpen(true); }}
              onLogout={() => {
                setIsSettingsOpen(false);
                setIsLinkedAccountsOpen(false);
                setIsStarredOpen(false);
                setIsStorageOpen(false);
                setIsPrivacyOpen(false);
                setIsHelpOpen(false);
                setIsAboutOpen(false);
                setIsNotificationsOpen(false);
                setIsLanguageOpen(false);
                setActiveChat(null);
                setIsComposing(false);
                setCurrentStep(2);
                localStorage.removeItem('phonemail_active_phone');
              }}
            />
          )}

          {currentStep === 5 && !isSettingsOpen && isLinkedAccountsOpen && (
            <LinkedAccounts darkMode={darkMode} onBack={() => { setIsLinkedAccountsOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && isStarredOpen && (
            <StarredMessages 
              chats={chats} 
              darkMode={darkMode} 
              onBack={() => { setIsStarredOpen(false); setIsSettingsOpen(true); }} 
              onSelectChat={(chat, msgId) => {
                setIsStarredOpen(false);
                setActiveChat({
                  ...chat,
                  highlightedMsgId: msgId
                });
              }} 
            />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && isStorageOpen && (
            <StorageData darkMode={darkMode} onBack={() => { setIsStorageOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && isPrivacyOpen && (
            <PrivacyScreen darkMode={darkMode} onBack={() => { setIsPrivacyOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && isHelpOpen && (
            <HelpSupport darkMode={darkMode} onBack={() => { setIsHelpOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && isAboutOpen && (
            <AboutPhoneMail darkMode={darkMode} onBack={() => { setIsAboutOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && isNotificationsOpen && (
            <NotificationsChimes darkMode={darkMode} onBack={() => { setIsNotificationsOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && isLanguageOpen && (
            <DisplayLanguage selectedLang={selectedLanguage} setLang={setSelectedLanguage} darkMode={darkMode} onBack={() => { setIsLanguageOpen(false); setIsSettingsOpen(true); }} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && !isLanguageOpen && activeAttachment && (
            <AttachmentViewer fileName={activeAttachment} onBack={() => setActiveAttachment(null)} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && !isLanguageOpen && !activeAttachment && activeCall && (
            <CallScreen chat={activeChat} isVideo={activeCall.isVideo} onEndCall={() => setActiveCall(null)} />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && !isLanguageOpen && !activeAttachment && !activeCall && isComposing && (
            <ComposeEmail 
              onBack={() => setIsComposing(false)}
              darkMode={darkMode}
              onSaveDraft={handleSaveDraftOnly}
              onSendMessage={(newChat) => {
                if (!newChat.subject || !newChat.subject.trim()) {
                  alert('Subject is mandatory for every mail.');
                  return;
                }

                const targetRecipient = newChat.recipient || '';
                const matchIndex = findMatchingChatIndex(chats, targetRecipient, phoneNumber);

                if (matchIndex === -2) {
                  handleSelfMessage({ text: newChat.snippet, subject: newChat.subject, recipient: targetRecipient });
                  setIsComposing(false);
                  return;
                }

                const savedSubjects = JSON.parse(localStorage.getItem('phonemail_recipient_subjects') || '{}');
                if (newChat.keepSubject && targetRecipient) {
                  savedSubjects[targetRecipient] = newChat.subject;
                } else if (targetRecipient && savedSubjects[targetRecipient]) {
                  delete savedSubjects[targetRecipient];
                }
                localStorage.setItem('phonemail_recipient_subjects', JSON.stringify(savedSubjects));

                const messageObj = {
                  id: Date.now(),
                  snippet: newChat.snippet,
                  body: newChat.snippet,
                  text: newChat.snippet,
                  subject: newChat.subject,
                  time: 'Just now',
                  sender: 'me',
                  starred: false
                };

                socket.emit('send_message', {
                  senderPhone: phoneNumber,
                  recipientIdentifier: targetRecipient,
                  messageObj: messageObj,
                  subject: newChat.subject
                });

                setIsComposing(false);
              }}
            />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && !isLanguageOpen && !activeAttachment && !activeCall && !isComposing && activeChat && isProfileOpen && (
            <ChatDetails 
              chat={activeChat} 
              darkMode={darkMode} 
              onBack={() => setIsProfileOpen(false)} 
              onUpdateChat={(updated) => {
                setChats(prev => prev.map(c => c.id === updated.id || c.name === updated.name ? updated : c));
                setActiveChat(updated);
              }}
            />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && !isLanguageOpen && !activeAttachment && !activeCall && !isComposing && activeChat && !isProfileOpen && (
            <ChatThread 
              chat={chats.find(c => String(c.id) === String(activeChat.id) || c.name === activeChat.name) || activeChat}
              highlightedMsgId={activeChat.highlightedMsgId}
              darkMode={darkMode}
              onBack={() => setActiveChat(null)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onStartCall={(isVideo) => setActiveCall({ isVideo })}
              onOpenAttachment={(text) => setActiveAttachment(text)}
              onUpdateMessages={(updatedMessages) => {
                setChats(prevChats => prevChats.map(c => {
                  if (String(c.id) === String(activeChat?.id) || c.name === activeChat?.name) {
                    return {
                      ...c,
                      messages: updatedMessages
                    };
                  }
                  return c;
                }));
              }}
              onSendMessage={({ text, subject, recipient, keepSubject, messages }) => {
                if (!subject || !subject.trim()) {
                  alert('Subject is mandatory for every mail.');
                  return;
                }

                const targetRecipient = recipient || activeChat?.recipient || activeChat?.name || '';
                const matchIndex = findMatchingChatIndex(chats, targetRecipient, phoneNumber);

                if (matchIndex === -2 || activeChat?.tag === 'Self') {
                  handleSelfMessage({ text, subject, recipient: targetRecipient, messages });
                  return;
                }

                const lastPassedMsg = messages[messages.length - 1];

                socket.emit('send_message', {
                  senderPhone: phoneNumber,
                  recipientIdentifier: targetRecipient,
                  messageObj: lastPassedMsg,
                  subject: subject
                });
              }}
            />
          )}

          {currentStep === 5 && !isSettingsOpen && !isLinkedAccountsOpen && !isStarredOpen && !isStorageOpen && !isPrivacyOpen && !isHelpOpen && !isAboutOpen && !isNotificationsOpen && !isLanguageOpen && !activeAttachment && !activeCall && !isComposing && !activeChat && (
            <Inbox 
              chats={localizedChats}
              darkMode={darkMode}
              selectedLang={selectedLanguage}
              triggerLiveSync={triggerLiveSync}
              onUpdateChat={(updated) => {
                setChats(prev => prev.map(c => c.id === updated.id ? updated : c).filter(c => !c.deleted));
              }}
              onForwardDraft={(draftChat) => {
                const recipient = prompt("Enter recipient phone, email ID, or name to forward this draft to:");
                if (!recipient || !recipient.trim()) return;

                const cleanRecipient = recipient.trim().replace(/\s+/g, '');
                const cleanPhone = (phoneNumber || '').replace(/\s+/g, '');

                if (cleanRecipient === '' || cleanRecipient === cleanPhone) {
                  alert("You cannot forward a draft to yourself. Drafts are stored in your Drafts folder.");
                  return;
                }

                const subject = prompt("Enter mandatory subject for the forwarded mail:", draftChat.subject || "Forwarded Draft Note");
                if (!subject || !subject.trim()) {
                  alert("Subject is mandatory for every mail.");
                  return;
                }

                const draftMessages = draftChat.messages || [{ id: draftChat.id, snippet: draftChat.snippet, body: draftChat.snippet, subject: draftChat.subject, time: draftChat.time, sender: 'me' }];
                const lastMsg = draftMessages[draftMessages.length - 1];

                socket.emit('send_message', {
                  senderPhone: phoneNumber,
                  recipientIdentifier: recipient.trim(),
                  messageObj: lastMsg,
                  subject: subject.trim()
                });
              }}
              onSelectChat={(chat) => {
                const updatedChats = chats.map(c => c.id === chat.id ? { ...c, unread: 0 } : c);
                setChats(updatedChats);
                
                const recipientKey = chat.recipient || chat.name;
                const savedSubjects = JSON.parse(localStorage.getItem('phonemail_recipient_subjects') || '{}');
                const rememberedSubject = savedSubjects[recipientKey] || chat.subject || '';

                setActiveChat({
                  ...(updatedChats.find(c => c.id === chat.id) || chat),
                  subject: rememberedSubject,
                  unread: 0
                });
              }}
              onCompose={() => setIsComposing(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenAbout={() => setIsAboutOpen(true)}
            />
          )}
        </>
      )}

    </div>
  );
}