import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUnreadCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      const { count: unread } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      setCount(unread || 0);
    };

    fetchCount();

    const channel = supabase
      .channel('unread-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`,
      }, () => {
        fetchCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return count;
}
