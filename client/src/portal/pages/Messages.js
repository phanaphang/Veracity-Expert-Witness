import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { messages, loading: msgsLoading, sendMessage } = useMessages(activeConv?.id);
  const threadRef = useRef();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('conversations')
      .select('*, participant_1_profile:profiles!conversations_participant_1_fkey(id, first_name, last_name, email), participant_2_profile:profiles!conversations_participant_2_fkey(id, first_name, last_name, email)')
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('last_message_at', { ascending: false })
      .then(({ data }) => setConversations(data || []));
  }, [user]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!activeConv || !user) return;
    supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', activeConv.id)
      .eq('recipient_id', user.id)
      .eq('is_read', false)
      .then();
  }, [activeConv, user, messages]);

  const getOtherParticipant = (conv) => {
    if (conv.participant_1 === user.id) return conv.participant_2_profile;
    return conv.participant_1_profile;
  };

  const getRecipientId = (conv) => {
    return conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    await sendMessage(newMessage.trim(), user.id, getRecipientId(activeConv));
    setNewMessage('');
  };

  const formatName = (p) => {
    if (p?.first_name) return `${p.first_name} ${p.last_name || ''}`.trim();
    return p?.email || 'Unknown';
  };

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No conversations yet</p>
        </div>
      ) : (
        <div className="portal-messages">
          <div className="portal-messages__list">
            {conversations.map(conv => {
              const other = getOtherParticipant(conv);
              return (
                <div
                  key={conv.id}
                  className={`portal-messages__item ${activeConv?.id === conv.id ? 'portal-messages__item--active' : ''}`}
                  onClick={() => setActiveConv(conv)}
                >
                  <div className="portal-messages__item-name">{formatName(other)}</div>
                  <div className="portal-messages__item-preview">
                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="portal-messages__thread">
            {activeConv ? (
              <>
                <div className="portal-messages__thread-header">
                  {formatName(getOtherParticipant(activeConv))}
                </div>
                <div className="portal-messages__thread-body" ref={threadRef}>
                  {msgsLoading ? (
                    <div className="portal-loading"><div className="portal-loading__spinner"></div></div>
                  ) : messages.length === 0 ? (
                    <div className="portal-empty"><p className="portal-empty__text">No messages yet</p></div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className={`portal-message ${msg.sender_id === user.id ? 'portal-message--sent' : 'portal-message--received'}`}>
                        {msg.content}
                        <div className="portal-message__time">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form className="portal-messages__input" onSubmit={handleSend}>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={5000}
                  />
                  <button type="submit" className="btn btn--primary" style={{ padding: '10px 20px' }}>Send</button>
                </form>
              </>
            ) : (
              <div className="portal-empty" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="portal-empty__text">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
