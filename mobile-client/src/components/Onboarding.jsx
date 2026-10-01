import { useState } from 'react';

// Dictionary for multi-language support
const translations = {
  English: {
    langTitle: 'App language',
    welcome: 'Welcome to PhoneMail',
    desc: 'Please read our terms and conditions. By tapping Agree and Continue, you accept our rules for using phone numbers as email IDs.',
    t1Title: '1. Account Creation:',
    t1Text: 'Your phone number acts as your core identity (e.g., yournumber@phonemail.com).',
    t2Title: '2. Privacy & Chats:',
    t2Text: 'All emails are organized into a chat-based messaging format.',
    t3Title: '3. Authentication:',
    t3Text: 'OTP-based verification is required to secure your inbox.',
    agree: 'I agree to the Terms of Service',
    button: 'AGREE AND CONTINUE',
    next: 'NEXT',
    termsHeader: 'Terms and Conditions'
  },
  हिन्दी: {
    langTitle: 'ऐप की भाषा',
    welcome: 'PhoneMail में आपका स्वागत है',
    desc: 'कृपया हमारे नियम और शर्तें पढ़ें। सहमत हैं और आगे बढ़ें पर टैप करके, आप फोन नंबर को ईमेल आईडी के रूप में उपयोग करने के हमारे नियमों को स्वीकार करते हैं।',
    t1Title: '1. खाता बनाना:',
    t1Text: 'आपका फोन नंबर आपकी मुख्य पहचान के रूप में कार्य करता है (जैसे, yournumber@phonemail.com)।',
    t2Title: '2. गोपनीयता और चैट:',
    t2Text: 'सभी ईमेल को चैट-आधारित मैसेजिंग प्रारूप में व्यवस्थित किया जाता है।',
    t3Title: '3. प्रमाणीकरण:',
    t3Text: 'आपके इनबॉक्स को सुरक्षित करने के लिए ओटीपी-आधारित सत्यापन आवश्यक है।',
    agree: 'मैं सेवा की शर्तों से सहमत हूँ',
    button: 'सहमत हैं और आगे बढ़ें',
    next: 'आगे',
    termsHeader: 'नियम और शर्तें'
  },
  தமிழ்: {
    langTitle: 'செயலி மொழி',
    welcome: 'PhoneMail-க்கு நல்வரவு',
    desc: 'எங்களின் விதிமுறைகள் மற்றும் நிபந்தனைகளைப் படிக்கவும். ஒப்புக்கொண்டு தொடர என்பதைத் தட்டுவதன் மூலம், தொலைபேசி எண்களை மின்னஞ்சல் ஐடிக்களாகப் பயன்படுத்துவதற்கான எங்கள் விதிகளை ஏற்றுக்கொள்கிறீர்கள்.',
    t1Title: '1. கணக்கு உருவாக்கம்:',
    t1Text: 'உங்கள் தொலைபேசி எண் உங்கள் முக்கிய அடையாளமாக செயல்படுகிறது (எ.கா., yournumber@phonemail.com).',
    t2Title: '2. தனியுரிமை மற்றும் அரட்டைகள்:',
    t2Text: 'அனைத்து மின்னஞ்சல்களும் அரட்டை அடிப்படையிலான செய்தி வடிவத்தில் ஒழுங்கமைக்கப்பட்டுள்ளன.',
    t3Title: '3. அங்கீகாரம்:',
    t3Text: 'உங்கள் இன்பாக்ஸைப் பாதுகாக்க OTP அடிப்படையிலான சரிபார்ப்பு தேவை.',
    agree: 'சேவை விதிமுறைகளை நான் ஒப்புக்கொள்கிறேன்',
    button: 'ஒப்புக்கொண்டு தொடரவும்',
    next: 'அடுத்து',
    termsHeader: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்'
  }
};

export default function Onboarding({ onComplete, selectedLang, setLang }) {
  const [subStep, setSubStep] = useState(1); // 1 for language, 2 for terms
  const [accepted, setAccepted] = useState(false);

  const t = translations[selectedLang] || translations.English;

  const languages = [
    { code: 'en', name: 'English', local: '(Device language)' },
    { code: 'hi', name: 'हिन्दी', local: 'Hindi' },
    { code: 'ta', name: 'தமிழ்', local: 'Tamil' },
  ];

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* Header with Back Arrow on Screen 2 */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '18px 16px', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
        {subStep === 2 && (
          <span 
            onClick={() => setSubStep(1)} 
            style={{ cursor: 'pointer', marginRight: '16px', fontSize: '22px', display: 'flex', alignItems: 'center', userSelect: 'none' }}
            title="Back to language selection"
          >
            ←
          </span>
        )}
        <span>{subStep === 1 ? t.langTitle : t.termsHeader}</span>
      </div>

      {/* Screen 1: Language Selection */}
      {subStep === 1 && (
        <>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => setLang(lang.name)}
                style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', color: '#111111', marginBottom: '2px' }}>{lang.name}</div>
                  <div style={{ fontSize: '14px', color: '#667781' }}>{lang.local}</div>
                </div>
                
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedLang === lang.name ? '#00A884' : '#8696A0'}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {selectedLang === lang.name && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00A884' }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #f0f2f5' }}>
            <button 
              onClick={() => setSubStep(2)}
              style={{ backgroundColor: '#00A884', color: 'white', border: 'none', borderRadius: '24px', padding: '12px 36px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' }}
            >
              {t.next}
            </button>
          </div>
        </>
      )}

      {/* Screen 2: Terms & Conditions */}
      {subStep === 2 && (
        <>
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', color: '#111111', marginBottom: '8px' }}>{t.welcome}</h2>
              <p style={{ fontSize: '14px', color: '#667781', lineHeight: '1.5' }}>{t.desc}</p>
            </div>

            <div style={{ backgroundColor: '#f0f2f5', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#3b4a54', height: '160px', overflowY: 'auto', marginBottom: '24px', lineHeight: '1.4' }}>
              <strong>{t.t1Title}</strong> {t.t1Text}<br/><br/>
              <strong>{t.t2Title}</strong> {t.t2Text}<br/><br/>
              <strong>{t.t3Title}</strong> {t.t3Text}
            </div>

            <div 
              onClick={() => setAccepted(!accepted)} 
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '20px' }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${accepted ? '#00A884' : '#8696A0'}`, backgroundColor: accepted ? '#00A884' : 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '12px' }}>
                {accepted && <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
              </div>
              <span style={{ fontSize: '14px', color: '#3b4a54' }}>{t.agree}</span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #f0f2f5' }}>
            <button 
              disabled={!accepted}
              onClick={onComplete}
              style={{ 
                backgroundColor: accepted ? '#00A884' : '#e9edef', 
                color: accepted ? 'white' : '#8696A0', 
                border: 'none', 
                borderRadius: '24px', 
                padding: '12px 36px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: accepted ? 'pointer' : 'not-allowed', 
                letterSpacing: '0.5px' 
              }}
            >
              {t.button}
            </button>
          </div>
        </>
      )}

    </div>
  );
}
