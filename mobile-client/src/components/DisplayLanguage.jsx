export default function DisplayLanguage({ selectedLang, setLang, onBack, darkMode }) {
  const bgScreen = darkMode ? '#0b141a' : '#f0f2f5';
  const bgCard = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e9edef';

  const languages = ['English', 'Hindi (हिंदी)', 'Tamil (தமிழ்)', 'Spanish', 'French'];

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgScreen, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', textAlign: 'left' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Display Language</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          CHOOSE APP LANGUAGE
        </div>
        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          {languages.map((lang) => {
            const langKey = lang.split(' ')[0];
            const isSelected = selectedLang === langKey;
            return (
              <div 
                key={lang}
                onClick={() => {
                  setLang(langKey);
                  onBack();
                }}
                style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer' }}
              >
                <span style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>{lang}</span>
                {isSelected && <span style={{ color: '#00A884', fontWeight: 'bold' }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
