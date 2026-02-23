import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import CalendarView from '../components/CalendarView';

export default function Calendar() {
  const { user } = useAuth();
  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">My Calendar</h1>
      </div>
      <div className="portal-card" style={{ padding: 16 }}>
        <CalendarView expertId={user.id} />
      </div>
    </div>
  );
}
