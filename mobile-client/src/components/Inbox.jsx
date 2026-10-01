import { useState, useRef, useEffect } from 'react';
import { translations } from '../utils/translations';

export default function Inbox({
  onSelectChat,
  onCompose,
  chats,
  onOpenSettings,
  onOpenAbout,
  darkMode,
  selectedLang,
  triggerLiveSync,
  onForwardDraft,
  onUpdateChat
}) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenuDraft, setContextMenuDraft] = useState(null);
  const [activeMenuChatId, setActiveMenuChatId] = useState(null);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('phonemail_inbox_scroll');

    if (savedScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem(
        'phonemail_inbox_scroll',
        scrollContainerRef.current.scrollTop
      );
    }
  };

  const t = translations[selectedLang] || translations['English'];

  const bgPrimary = darkMode ? '#111b21' : '#ffffff';
  const bgSecondary = darkMode ? '#222d34' : '#f0f2f5';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#f0f2f5';
  const chipBg = darkMode ? '#222d34' : '#e9edef';
  const chipText = darkMode ? '#8696a0' : '#3b4a54';
  const badgeBg = darkMode ? '#2a3942' : '#e2e8f0';

  const chatList = chats || [];

  const query = searchQuery.toLowerCase().trim();

  /*
   * ============================================================
   * NORMAL CHAT FILTERING & SORTING (Pinned First)
   * ============================================================
   */

  const filteredChats = chatList.filter(chat => {
    if (chat.deleted) return false;

    const chatName = (chat.name || '').toLowerCase();
    const chatSnippet = (chat.snippet || '').toLowerCase();

    const matchesSearch =
      chatName.includes(query) ||
      chatSnippet.includes(query) ||
      (
        chat.messages &&
        chat.messages.some(m =>
          (m.snippet || m.body || m.text || '')
            .toLowerCase()
            .includes(query)
        )
      );

    const isDraftChat =
      chat.tag === 'Drafts' ||
      chat.name?.includes('Drafts');

    if (filter === 'Unread') {
      return (
        matchesSearch &&
        (chat.unread || 0) > 0 &&
        !isDraftChat
      );
    }

    if (filter === 'Favourites') {
      return matchesSearch && (chat.tag === 'Favourites' || chat.favourite);
    }

    if (filter === 'Attachments') {
      return matchesSearch && (chat.snippet?.includes('📎') || chat.tag === 'Attachments');
    }

    if (filter === 'Pinned') {
      return matchesSearch && chat.pinned;
    }

    if (filter === 'Starred') {
      return false;
    }

    return matchesSearch;
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  /*
   * ============================================================
   * STARRED MESSAGE TILES
   * ============================================================
   */

  const starredItems = [];

  if (filter === 'Starred') {
    chatList.forEach(chat => {
      if (!Array.isArray(chat.messages)) return;

      chat.messages.forEach(message => {
        if (!message.starred) return;

        const messageText =
          message.text ||
          message.snippet ||
          message.body ||
          '';

        const messageSubject =
          message.subject ||
          chat.subject ||
          '';

        const chatName =
          chat.name ||
          chat.recipient ||
          'Chat';

        const matchesSearch =
          !query ||
          chatName.toLowerCase().includes(query) ||
          messageText.toLowerCase().includes(query) ||
          messageSubject.toLowerCase().includes(query);

        if (!matchesSearch) return;

        starredItems.push({
          chat,
          message,
          tileId: `${chat.id}-${message.id}`,
          chatName,
          messageId: message.id,
          text: messageText,
          subject: messageSubject,
          time:
            message.time ||
            chat.time ||
            'Just now',
          sender: message.sender
        });
      });
    });
  }

  const filterTabs = [
    { key: 'All', label: t.all },
    { key: 'Unread', label: t.unread },
    { key: 'Favourites', label: t.favourites },
    { key: 'Attachments', label: t.attachments },
    { key: 'Pinned', label: '📌 Pinned' },
    { key: 'Starred', label: '⭐ Starred' }
  ];

  /*
   * ============================================================
   * STARRED MESSAGE TILE
   * ============================================================
   */

  const renderStarredTile = item => {
    const displayName = item.chatName;

    const initial =
      displayName && displayName.length > 0
        ? displayName[0].toUpperCase()
        : 'U';

    return (
      <div
        key={item.tileId}
        onClick={() => {
          onSelectChat &&
            onSelectChat({
              ...item.chat,
              highlightedMsgId: item.messageId
            });
        }}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '13px 16px',
          borderBottom: `1px solid ${borderColor}`,
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: bgPrimary
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#00A884',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            color: '#fff',
            marginRight: '14px',
            flexShrink: 0,
            fontSize: '18px'
          }}
        >
          {initial}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: 'left'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px',
              gap: '8px'
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0
              }}
            >
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {displayName}
              </span>

              <span
                style={{
                  fontSize: '12px',
                  flexShrink: 0
                }}
              >
                ⭐
              </span>
            </div>

            <span
              style={{
                fontSize: '12px',
                color: subText,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {item.time}
            </span>
          </div>

          {item.subject && (
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: textColor,
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              Subject: {item.subject}
            </div>
          )}

          <div
            style={{
              fontSize: '14px',
              color: subText,
              lineHeight: '1.4',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {item.text}
          </div>
        </div>
      </div>
    );
  };

  /*
   * ============================================================
   * NORMAL CHAT TILE
   * ============================================================
   */

  const renderChatTile = (chat, idx) => {
    const isDraft =
      chat.tag === 'Drafts' ||
      chat.name?.includes('Drafts');

    const isMenuOpen = activeMenuChatId === chat.id;
    const isFavourite = chat.tag === 'Favourites' || chat.favourite;

    return (
      <div
        key={`${chat.id}-${idx}`}
        onClick={() =>
          onSelectChat && onSelectChat(chat)
        }
        onContextMenu={e => {
          if (isDraft && onForwardDraft) {
            e.preventDefault();

            setContextMenuDraft({
              chat,
              x: e.clientX,
              y: e.clientY
            });
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: `1px solid ${borderColor}`,
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: chat.pinned ? (darkMode ? '#182229' : '#f8fafc') : bgPrimary
        }}
      >

        {/* Avatar */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isDraft
              ? '#54656f'
              : '#00A884',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            color: '#fff',
            marginRight: '14px',
            flexShrink: 0,
            fontSize: isDraft
              ? '20px'
              : '18px'
          }}
        >
          {isDraft
            ? '📝'
            : (chat.name ? chat.name[0] : 'U')}
        </div>

        {/* Chat content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: 'left'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px'
            }}
          >

            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textAlign: 'left',
                minWidth: 0
              }}
            >
              {chat.pinned && (
                <span style={{ backgroundColor: badgeBg, borderRadius: '6px', padding: '1px 5px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }} title="Pinned Chat">
                  📌
                </span>
              )}
              {isFavourite && (
                <span style={{ backgroundColor: badgeBg, borderRadius: '6px', padding: '1px 5px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }} title="Favourite Chat">
                  💖
                </span>
              )}
              {chat.muted && (
                <span style={{ backgroundColor: badgeBg, borderRadius: '6px', padding: '1px 5px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }} title="Muted">
                  🔕
                </span>
              )}

              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.name}</span>

              {isDraft && (
                <span
                  style={{
                    fontSize: '11px',
                    backgroundColor: darkMode
                      ? '#222d34'
                      : '#f0f2f5',
                    color: subText,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '500',
                    border: `1px solid ${
                      darkMode
                        ? '#3a4a54'
                        : '#d1d7db'
                    }`
                  }}
                >
                  (Drafts)
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: '12px',
                color:
                  (chat.unread || 0) > 0
                    ? '#00A884'
                    : subText,
                flexShrink: 0
              }}
            >
              {chat.time}
            </span>

          </div>

          <div
            style={{
              fontSize: '14px',
              color: subText,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'left'
            }}
          >
            {chat.snippet}
          </div>
        </div>

        {/* Unread count & Dropdown Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
          {(chat.unread || 0) > 0 && !isDraft && (
            <div
              style={{
                minWidth: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#00A884',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 4px'
              }}
            >
              {chat.unread}
            </div>
          )}

          <div 
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuChatId(isMenuOpen ? null : chat.id);
            }}
            style={{ padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', color: subText, fontSize: '16px', fontWeight: 'bold' }}
            title="Chat Options"
          >
            ⋮
          </div>
        </div>

        {/* Chat Tile Dropdown Menu */}
        {isMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50px',
              backgroundColor: darkMode ? '#222d34' : '#ffffff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              border: `1px solid ${darkMode ? '#374248' : '#e2e8f0'}`,
              borderRadius: '12px',
              zIndex: 30,
              padding: '6px',
              width: '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              textAlign: 'left'
            }}
          >
            <div 
              onClick={() => {
                setActiveMenuChatId(null);
                if (onUpdateChat) {
                  onUpdateChat({ ...chat, pinned: !chat.pinned });
                }
              }}
              style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{chat.pinned ? '📍 Unpin Chat' : '📌 Pin Chat'}</span>
            </div>

            <div 
              onClick={() => {
                setActiveMenuChatId(null);
                if (onUpdateChat) {
                  const newFav = !isFavourite;
                  onUpdateChat({ ...chat, favourite: newFav, tag: newFav ? 'Favourites' : 'Unread' });
                }
              }}
              style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{isFavourite ? '💔 Remove Favourite' : '💖 Add to Favourites'}</span>
            </div>

            <div 
              onClick={() => {
                setActiveMenuChatId(null);
                if (onUpdateChat) {
                  onUpdateChat({ ...chat, muted: !chat.muted });
                }
              }}
              style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{chat.muted ? '🔔 Unmute Notifications' : '🔕 Mute Notifications'}</span>
            </div>

            <div 
              onClick={() => {
                setActiveMenuChatId(null);
                if (onUpdateChat) {
                  const newUnread = chat.unread > 0 ? 0 : 1;
                  onUpdateChat({ ...chat, unread: newUnread });
                }
              }}
              style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: textColor, borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{chat.unread > 0 ? '👁️ Mark as Read' : '📬 Mark as Unread'}</span>
            </div>

            <div 
              onClick={() => {
                setActiveMenuChatId(null);
                if (onUpdateChat) {
                  onUpdateChat({ ...chat, deleted: true });
                }
              }}
              style={{ padding: '8px 10px', cursor: 'pointer', backgroundColor: darkMode ? '#111b21' : '#f0f2f5', color: '#df3333', borderRadius: '8px', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>🗑️ Delete Chat</span>
            </div>
          </div>
        )}

      </div>
    );
  };

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: 'Helvetica, Arial, sans-serif',
        backgroundColor: bgPrimary,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative'
      }}
      onClick={() => {
        setShowMenu(false);
        setContextMenuDraft(null);
        setActiveMenuChatId(null);
      }}
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div
        style={{
          backgroundColor: '#075E54',
          color: 'white',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          minHeight: '36px'
        }}
      >

        {isSearching ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1,
              marginRight: '10px'
            }}
          >
            <span
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                padding: '4px'
              }}
            >
              ←
            </span>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e =>
                setSearchQuery(e.target.value)
              }
              placeholder={t.search}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '16px',
                fontFamily: 'inherit'
              }}
            />
          </div>
        ) : (
          <span
            onDoubleClick={triggerLiveSync}
            style={{
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '0.3px',
              userSelect: 'none',
              cursor: 'pointer'
            }}
            title="Double-click to simulate incoming message"
          >
            PhoneMail
          </span>
        )}

        <div
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}
        >

          {!isSearching && (
            <div
              onClick={() => setIsSearching(true)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>
            </div>
          )}

          <div
            style={{
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              onClick={() =>
                setShowMenu(!showMenu)
              }
              style={{
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="More options"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </div>

            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '38px',
                  backgroundColor: darkMode
                    ? '#222d34'
                    : '#ffffff',
                  boxShadow:
                    '0 4px 16px rgba(0,0,0,0.2)',
                  borderRadius: '16px',
                  width: '170px',
                  zIndex: 10,
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >

                <div
                  onClick={() => {
                    setShowMenu(false);
                    onOpenSettings &&
                      onOpenSettings();
                  }}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    backgroundColor: darkMode
                      ? '#111b21'
                      : '#f0f2f5',
                    color: textColor,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>⚙️</span>
                  {t.settings}
                </div>

                <div
                  onClick={() => {
                    setShowMenu(false);
                    onOpenAbout &&
                      onOpenAbout();
                  }}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    backgroundColor: darkMode
                      ? '#111b21'
                      : '#f0f2f5',
                    color: textColor,
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>ℹ</span>
                  {t.about}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* ======================================================
          FILTER TABS
          ====================================================== */}

      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
          backgroundColor: bgSecondary,
          overflowX: 'auto'
        }}
      >
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() =>
              setFilter(tab.key)
            }
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor:
                filter === tab.key
                  ? '#075E54'
                  : chipBg,
              color:
                filter === tab.key
                  ? '#fff'
                  : chipText,
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================
          CHAT / STARRED MESSAGE LIST
          ====================================================== */}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: bgPrimary,
          position: 'relative'
        }}
      >

        {filter === 'Starred' ? (

          /*
           * STARRED MODE
           *
           * Every starred message gets its own tile.
           */
          starredItems.length > 0 ? (
            starredItems.map(renderStarredTile)
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 30px',
                color: subText,
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              ⭐ No starred messages yet.
              <br />
              Star important messages to find them here easily.
            </div>
          )

        ) : (

          /*
           * NORMAL MODE
           *
           * All / Unread / Favourites / Attachments / Pinned
           * continue to show one tile per chat.
           */
          filteredChats.length > 0 ? (
            filteredChats.map(renderChatTile)
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: subText,
                fontSize: '14px'
              }}
            >
              No chats found matching your search.
            </div>
          )

        )}

      </div>

      {/* ======================================================
          DRAFT CONTEXT MENU
          ====================================================== */}

      {contextMenuDraft && (
        <div
          style={{
            position: 'fixed',
            top: contextMenuDraft.y,
            left: Math.min(
              contextMenuDraft.x,
              220
            ),
            backgroundColor: darkMode
              ? '#222d34'
              : '#ffffff',
            boxShadow:
              '0 4px 16px rgba(0,0,0,0.3)',
            borderRadius: '12px',
            zIndex: 100,
            padding: '6px',
            width: '180px'
          }}
        >
          <div
            onClick={e => {
              e.stopPropagation();

              const targetChat =
                contextMenuDraft.chat;

              setContextMenuDraft(null);

              onForwardDraft &&
                onForwardDraft(targetChat);
            }}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              backgroundColor: darkMode
                ? '#111b21'
                : '#f0f2f5',
              color: textColor,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>📤</span>
            Forward Draft to Anyone
          </div>
        </div>
      )}

      {/* ======================================================
          COMPOSE BUTTON
          ====================================================== */}

      <button
        onClick={onCompose}
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#00A884',
          color: '#fff',
          border: 'none',
          boxShadow:
            '0 4px 10px rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: '5'
        }}
        title="Compose Email"
      >
        ✉️
      </button>

    </div>
  );
}