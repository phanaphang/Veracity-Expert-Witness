import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) { setLoading(false); return; }

    setLoading(true);
    supabase
      .from('messages')
      .select('*, sender_profile:profiles!messages_sender_id_fkey(first_name, last_name, email)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
        setLoading(false);
      });

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, sender_profile:profiles!messages_sender_id_fkey(first_name, last_name, email)')
          .eq('id', payload.new.id)
          .single();
        setMessages(prev => [...prev, data || payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const sendMessage = useCallback(async (content, senderId, recipientId) => {
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    });
    if (!error) {
      await supabase.from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);
    }
    return { error };
  }, [conversationId]);

  return { messages, loading, sendMessage };
}
