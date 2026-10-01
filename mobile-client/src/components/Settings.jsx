import { translations } from '../utils/translations';

export default function Settings({ phoneNumber, selectedLang, onBack, onOpenLinkedAccounts, onOpenStorage, onOpenPrivacy, onOpenHelp, onOpenAbout, onOpenNotifications, onOpenLanguage, onLogout, darkMode, setDarkMode }) {
  const t = translations[selectedLang] || translations['English'];

  const bgPrimary = darkMode ? '#111b21' : '#ffffff';
  const bgSecondary = darkMode ? '#222d34' : '#f0f2f5';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e9edef';
  const iconColor = darkMode ? '#8696a0' : '#54656f';

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgSecondary, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', textAlign: 'left' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600', textAlign: 'left' }}>{t.settings}</div>
      </div>

      {/* Settings Body */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        
        {/* Profile Tile */}
        <div style={{ backgroundColor: bgPrimary, padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${borderColor}`, borderTop: `1px solid ${borderColor}`, cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#00A884', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', flexShrink: '0' }}>
            AR
          </div>
          <div style={{ flex: 1, minWidth: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: '600', color: textColor, marginBottom: '2px', textAlign: 'left' }}>Abhishek Rathore</div>
            <div style={{ fontSize: '13px', color: subText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>{phoneNumber || '+91 9876543210'} • PhoneMail ID</div>
          </div>
        </div>

        {/* Tile Group: Account & Security */}
        <div style={{ backgroundColor: bgPrimary, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div 
            onClick={onOpenLinkedAccounts}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderBottom: `1px solid ${borderColor}` }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.accountSecurity}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.accountSecurityDesc}</div>
            </div>
          </div>

          <div 
            onClick={onOpenPrivacy}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.privacy}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.privacyDesc}</div>
            </div>
          </div>

        </div>

        {/* Tile Group: Appearance */}
        <div style={{ backgroundColor: bgPrimary, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.darkTheme}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.darkThemeDesc}</div>
            </div>
            <input 
              type="checkbox" 
              checked={!!darkMode} 
              onChange={() => setDarkMode && setDarkMode(!darkMode)}
              style={{ width: '20px', height: '20px', accentColor: '#00A884', cursor: 'pointer' }}
            />
          </div>

          <div 
            onClick={onOpenLanguage}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.displayLanguage}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{selectedLang}</div>
            </div>
          </div>

        </div>

        {/* Tile Group: Notifications & Storage */}
        <div style={{ backgroundColor: bgPrimary, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div 
            onClick={onOpenNotifications}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderBottom: `1px solid ${borderColor}` }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.notifications}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.notificationsDesc}</div>
            </div>
          </div>

          <div 
            onClick={onOpenStorage}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.storage}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.storageDesc}</div>
            </div>
          </div>

        </div>

        {/* Tile Group: Help & About */}
        <div style={{ backgroundColor: bgPrimary, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div 
            onClick={onOpenHelp}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderBottom: `1px solid ${borderColor}` }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.help}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.helpDesc}</div>
            </div>
          </div>

          <div 
            onClick={onOpenAbout}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconColor, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor, textAlign: 'left' }}>{t.about}</div>
              <div style={{ fontSize: '12px', color: subText, textAlign: 'left' }}>{t.aboutDesc}</div>
            </div>
          </div>

        </div>

        {/* Logout Tile */}
        <div style={{ backgroundColor: bgPrimary, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, marginTop: '8px' }}>
          <div 
            onClick={onLogout}
            style={{ padding: '16px', fontSize: '15px', color: '#d9534f', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}
          >
            <div style={{ width: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d9534f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>{t.logout}</div>
          </div>
        </div>

      </div>

    </div>
  );
}