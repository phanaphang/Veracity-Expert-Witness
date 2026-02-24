import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function toDatetimeLocal(date) {
  if (!date) return '';
  const d = new Date(date);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d - off).toISOString().slice(0, 16);
}

function EventModal({ event, slot, expertId, cases, onClose, onSaved, onDeleted }) {
  const isNew = !event?.id;
  const [title, setTitle] = useState(event?.title || '');
  const [start, setStart] = useState(
    event ? toDatetimeLocal(event.start) : slot ? toDatetimeLocal(slot.start) : ''
  );
  const [end, setEnd] = useState(
    event ? toDatetimeLocal(event.end) : slot ? toDatetimeLocal(slot.end) : ''
  );
  const [notes, setNotes] = useState(event?.resource?.notes || '');
  const [caseId, setCaseId] = useState(event?.resource?.case_id || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!start || !end) { setError('Start and end times are required.'); return; }
    if (new Date(start) >= new Date(end)) { setError('End time must be after start time.'); return; }
    setSaving(true);
    setError('');
    const payload = {
      expert_id: expertId,
      title: title.trim(),
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
      notes: notes.trim(),
      case_id: caseId || null,
    };
    let result;
    if (isNew) {
      result = await supabase.from('calendar_events').insert(payload).select().single();
    } else {
      result = await supabase.from('calendar_events').update(payload).eq('id', event.id).select().single();
    }
    setSaving(false);
    if (result.error) { setError(result.error.message); return; }
    onSaved(result.data, isNew);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    setDeleting(true);
    await supabase.from('calendar_events').delete().eq('id', event.id);
    setDeleting(false);
    onDeleted(event.id);
  };

  return (
    <div className="cal-modal-backdrop" onClick={onClose}>
      <div className="cal-modal" onClick={e => e.stopPropagation()}>
        <div className="cal-modal__header">
          <span className="cal-modal__title">{isNew ? 'New Event' : 'Edit Event'}</span>
          <button className="cal-modal__close" onClick={onClose}>&#x2715;</button>
        </div>

        {error && <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 8 }}>{error}</p>}

        <div className="portal-form__group">
          <label className="portal-form__label">Title *</label>
          <input
            className="portal-form__input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Event title"
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="portal-form__group">
            <label className="portal-form__label">Start *</label>
            <input
              className="portal-form__input"
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
            />
          </div>
          <div className="portal-form__group">
            <label className="portal-form__label">End *</label>
            <input
              className="portal-form__input"
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="portal-form__group">
          <label className="portal-form__label">Notes</label>
          <textarea
            className="portal-form__input portal-form__textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Optional notes"
          />
        </div>

        {cases.length > 0 && (
          <div className="portal-form__group">
            <label className="portal-form__label">Linked Case</label>
            <select
              className="portal-form__input portal-form__select"
              value={caseId}
              onChange={e => setCaseId(e.target.value)}
            >
              <option value="">— None —</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="cal-modal__actions">
          {!isNew && (
            <button
              className="cal-modal__delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button className="portal-btn-action" onClick={onClose}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarView({ expertId, readOnly = false }) {
  const [events, setEvents] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    if (!expertId) return;
    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('expert_id', expertId)
      .order('start_time', { ascending: true });
    if (data) {
      setEvents(data.map(ev => ({
        id: ev.id,
        title: ev.title,
        start: new Date(ev.start_time),
        end: new Date(ev.end_time),
        resource: { notes: ev.notes, case_id: ev.case_id },
      })));
    }
  }, [expertId]);

  useEffect(() => {
    loadEvents();
    if (!expertId) return;
    supabase
      .from('cases')
      .select('id, title')
      .eq('assigned_expert', expertId)
      .then(({ data }) => setCases(data || []));
  }, [expertId, loadEvents]);

  const handleSelectSlot = (slot) => {
    if (readOnly) return;
    setSelectedEvent(null);
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    if (readOnly) return;
    setSelectedSlot(null);
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSaved = async (row, isNew) => {
    setModalOpen(false);
    loadEvents();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id === expertId) return;
      await fetch('/api/notify-calendar-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          expertId,
          eventTitle: row.title,
          startTime: row.start_time,
          endTime: row.end_time,
          action: isNew ? 'created' : 'updated',
        }),
      });
    } catch (e) {
      // Notification is best-effort — don't block the UI
    }
  };

  const handleDeleted = (id) => {
    setModalOpen(false);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={!readOnly}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
        defaultView="month"
        style={{ height: '100%' }}
      />

      {modalOpen && (
        <EventModal
          event={selectedEvent}
          slot={selectedSlot}
          expertId={expertId}
          cases={cases}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
