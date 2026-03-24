import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useMessages } from '../../hooks/useMessages'
import { useToast } from '../../contexts/ToastContext'
import { formatName } from '../../utils/formatName'

export default function Messages() {
  const { user, profile } = useAuth()
  const { error: toastError } = useToast()
  const [conversations, setConversations] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({})
  const [lastMessages, setLastMessages] = useState({})
  const [activeConv, setActiveConv] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const {
    messages,
    loading: msgsLoading,
    sendMessage,
  } = useMessages(activeConv?.id)
  const threadRef = useRef()

  useEffect(() => {
    if (!user) return
    supabase
      .from('conversations')
      .select(
        '*, participant_1_profile:profiles!conversations_participant_1_fkey(id, first_name, last_name, email, role), participant_2_profile:profiles!conversations_participant_2_fkey(id, first_name, last_name, email, role)'
      )
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order('last_message_at', { ascending: false })
      .then(async ({ data }) => {
        const convs = data || []
        setConversations(convs)
        if (convs.length === 0) return
        const convIds = convs.map((c) => c.id)
        const [unreadRes, lastMsgRes] = await Promise.all([
          supabase
            .from('messages')
            .select('conversation_id')
            .eq('recipient_id', user.id)
            .eq('is_read', false)
            .in('conversation_id', convIds),
          supabase
            .from('messages')
            .select('conversation_id, content')
            .in('conversation_id', convIds)
            .order('created_at', { ascending: false }),
        ])
        const counts = {}
        ;(unreadRes.data || []).forEach((m) => {
          counts[m.conversation_id] = (counts[m.conversation_id] || 0) + 1
        })
        setUnreadCounts(counts)
        const last = {}
        ;(lastMsgRes.data || []).forEach((m) => {
          if (!last[m.conversation_id]) last[m.conversation_id] = m.content
        })
        setLastMessages(last)
      })
  }, [user])

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!activeConv || !user) return
    supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', activeConv.id)
      .eq('recipient_id', user.id)
      .eq('is_read', false)
      .then()
    setUnreadCounts((prev) => ({ ...prev, [activeConv.id]: 0 }))
  }, [activeConv, user, messages])

  const getOtherParticipant = (conv) => {
    if (conv.participant_1 === user.id) return conv.participant_2_profile
    return conv.participant_1_profile
  }

  const getRecipientId = (conv) => {
    return conv.participant_1 === user.id
      ? conv.participant_2
      : conv.participant_1
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv) return
    const { error } = await sendMessage(
      newMessage.trim(),
      user.id,
      getRecipientId(activeConv),
      formatName(profile)
    )
    if (error) {
      toastError('Failed to send message')
      return
    }
    setNewMessage('')
  }

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
            {conversations.map((conv) => {
              const other = getOtherParticipant(conv)
              return (
                <button
                  type="button"
                  key={conv.id}
                  className={`portal-messages__item ${activeConv?.id === conv.id ? 'portal-messages__item--active' : ''}`}
                  onClick={() => setActiveConv(conv)}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <div className="portal-messages__item-name">
                      {formatName(other)}
                    </div>
                    {unreadCounts[conv.id] > 0 && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--color-accent)',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                  <div
                    className="portal-messages__item-preview"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {lastMessages[conv.id]
                      ? lastMessages[conv.id].length > 50
                        ? lastMessages[conv.id].slice(0, 50) + '...'
                        : lastMessages[conv.id]
                      : conv.last_message_at
                        ? new Date(conv.last_message_at).toLocaleDateString()
                        : ''}
                  </div>
                </button>
              )
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
                    <div
                      className="portal-loading"
                      role="status"
                      aria-label="Loading"
                    >
                      <div className="portal-loading__spinner"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="portal-empty">
                      <p className="portal-empty__text">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSent = msg.sender_id === user.id
                      const senderProfile =
                        msg.sender_id === activeConv.participant_1
                          ? activeConv.participant_1_profile
                          : activeConv.participant_2_profile
                      return (
                        <div
                          key={msg.id}
                          className={`portal-message ${isSent ? 'portal-message--sent' : 'portal-message--received'}`}
                        >
                          <div
                            className="portal-message__sender"
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              marginBottom: 2,
                              color: isSent
                                ? 'rgba(255,255,255,0.85)'
                                : 'var(--color-gray-500)',
                            }}
                          >
                            {isSent ? 'You' : formatName(senderProfile)}
                          </div>
                          {msg.content}
                          <div className="portal-message__time">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <form className="portal-messages__input" onSubmit={handleSend}>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={5000}
                    aria-label="Type a message"
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ padding: '10px 20px' }}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div
                className="portal-empty"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p className="portal-empty__text">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
