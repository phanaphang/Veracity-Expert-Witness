import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { formatName } from '../../utils/formatName';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const { messages, loading: msgsLoading, sendMessage } = useMessages(activeConv?.id);
  const threadRef = useRef();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('conversations')
      .select('*, participant_1_profile:profiles!conversations_participant_1_fkey(id, first_name, last_name, email, role), participant_2_profile:profiles!conversations_participant_2_fkey(id, first_name, last_name, email, role)')
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('last_message_at', { ascending: false })
      .then(({ data }) => setConversations(data || []));

    supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('role', ['admin', 'staff'])
      .order('first_name', { ascending: true })
      .then(({ data }) => setStaffList(data || []));
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

  const startNewChat = async (recipientId) => {
    const existing = conversations.find(c =>
      (c.participant_1 === user.id && c.participant_2 === recipientId) ||
      (c.participant_2 === user.id && c.participant_1 === recipientId)
    );
    if (existing) {
      setActiveConv(existing);
      setShowNewChat(false);
      return;
    }
    const { data } = await supabase
      .from('conversations')
      .insert({ participant_1: user.id, participant_2: recipientId })
      .select('*, participant_1_profile:profiles!conversations_participant_1_fkey(id, first_name, last_name, email, role), participant_2_profile:profiles!conversations_participant_2_fkey(id, first_name, last_name, email, role)')
      .single();
    if (data) {
      setConversations(prev => [data, ...prev]);
      setActiveConv(data);
    }
    setShowNewChat(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    await sendMessage(newMessage.trim(), user.id, getRecipientId(activeConv));
    setNewMessage('');
  };


  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Messages</h1>
        <button className="btn btn--primary" onClick={() => setShowNewChat(!showNewChat)} style={{ padding: '10px 20px' }}>
          New Conversation
        </button>
      </div>

      {showNewChat && (
        <div className="portal-card" style={{ marginBottom: 16 }}>
          <h3 className="portal-card__title">Start New Conversation</h3>
          {staffList.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)' }}>No staff or admin users found.</p>
          ) : (
            <div>
              {staffList.map(person => (
                <div key={person.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                  <span>
                    {formatName(person)}
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', marginLeft: 8 }}>{person.role}</span>
                  </span>
                  <button className="portal-btn-action" onClick={() => startNewChat(person.id)}>Message</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {conversations.length === 0 && !showNewChat ? (
        <div className="portal-empty">
          <p className="portal-empty__text">No conversations yet</p>
        </div>
      ) : conversations.length > 0 && (
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
                    messages.map(msg => {
                      const isSent = msg.sender_id === user.id;
                      const senderProfile = msg.sender_id === activeConv.participant_1 ? activeConv.participant_1_profile : activeConv.participant_2_profile;
                      return (
                        <div key={msg.id} className={`portal-message ${isSent ? 'portal-message--sent' : 'portal-message--received'}`}>
                          <div className="portal-message__sender" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 2, color: isSent ? 'rgba(255,255,255,0.85)' : 'var(--color-gray-500)' }}>
                            {isSent ? 'You' : formatName(senderProfile)}
                          </div>
                          {msg.content}
                          <div className="portal-message__time">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      );
                    })
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
