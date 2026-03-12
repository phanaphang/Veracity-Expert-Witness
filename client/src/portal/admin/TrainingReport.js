import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LESSONS, LESSON_SEQUENCE, UNITS } from '../training/courseData';

const TOTAL_LESSONS = LESSON_SEQUENCE.length;
const TOTAL_QUIZZES = UNITS.length;

function aggregateProgress(rows) {
  const completedLessonIds = rows
    .filter((r) => LESSON_SEQUENCE.includes(r.lesson_id) && r.completed)
    .map((r) => r.lesson_id);

  const passedQuizIds = [];
  UNITS.forEach((unit) => {
    const row = rows.find((r) => r.lesson_id === `quiz-${unit.id}`);
    if (row?.quiz_scores?.[unit.id] >= 2) passedQuizIds.push(unit.id);
  });

  const assessmentRow = rows.find((r) => r.lesson_id === 'assessment');
  const assessmentPassed = assessmentRow?.completed || false;
  const assessmentScore = assessmentRow?.quiz_scores?.assessment ?? null;
  const certified = !!(assessmentRow?.certificate_issued_at);
  const certName = assessmentRow?.certificate_name || '';
  const certDate = assessmentRow?.certificate_issued_at || null;
  const pct = Math.round((completedLessonIds.length / TOTAL_LESSONS) * 100);

  let status = 'not-started';
  if (certified) status = 'certified';
  else if (assessmentPassed) status = 'completed';
  else if (completedLessonIds.length > 0) status = 'in-progress';

  return {
    completedLessonIds,
    passedQuizIds,
    lessonsCompleted: completedLessonIds.length,
    quizzesPassed: passedQuizIds.length,
    assessmentPassed,
    assessmentScore,
    certified,
    certName,
    certDate,
    pct,
    status,
  };
}

const STATUS_LABELS = {
  'not-started': { label: 'Not Started', cls: 'portal-badge--pending' },
  'in-progress':  { label: 'In Progress',  cls: 'portal-badge--open' },
  'completed':    { label: 'Asmt. Passed', cls: '' },
  'certified':    { label: 'Certified',    cls: 'portal-badge--approved' },
};

export default function TrainingReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [{ data: experts }, { data: progress }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('role', 'expert')
          .order('last_name', { ascending: true }),
        supabase
          .from('training_progress')
          .select('user_id, lesson_id, completed, quiz_scores, certificate_name, certificate_issued_at'),
      ]);

      const byUser = {};
      (progress || []).forEach((r) => {
        if (!byUser[r.user_id]) byUser[r.user_id] = [];
        byUser[r.user_id].push(r);
      });

      setRows(
        (experts || []).map((exp) => ({
          expert: exp,
          progress: aggregateProgress(byUser[exp.id] || []),
        }))
      );
      setLoading(false);
    };
    load();
  }, []);

  const filtered = rows.filter(({ expert, progress }) => {
    const name = `${expert.first_name || ''} ${expert.last_name || ''} ${expert.email || ''}`.toLowerCase();
    if (search && !name.includes(search.toLowerCase())) return false;
    if (filterStatus && progress.status !== filterStatus) return false;
    return true;
  });

  const counts = rows.reduce(
    (acc, { progress: p }) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; },
    { 'not-started': 0, 'in-progress': 0, completed: 0, certified: 0 }
  );

  if (loading) {
    return (
      <div className="portal-loading">
        <div className="portal-loading__spinner" />
        <p>Loading training data…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">Training Report</h1>
        <p className="portal-page__subtitle">Expert Witness Foundations — panel progress overview</p>
      </div>

      {/* Summary stats — clicking filters the table */}
      <div className="portal-stats" style={{ marginBottom: 24 }}>
        <div className="portal-stat" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('')}>
          <div className="portal-stat__value">{rows.length}</div>
          <div className="portal-stat__label">Total Experts</div>
        </div>
        <div className="portal-stat" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('certified')}>
          <div className="portal-stat__value" style={{ color: 'var(--color-accent)' }}>{counts.certified}</div>
          <div className="portal-stat__label">Certified</div>
        </div>
        <div className="portal-stat" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('completed')}>
          <div className="portal-stat__value">{counts.completed}</div>
          <div className="portal-stat__label">Asmt. Passed</div>
        </div>
        <div className="portal-stat" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('in-progress')}>
          <div className="portal-stat__value">{counts['in-progress']}</div>
          <div className="portal-stat__label">In Progress</div>
        </div>
        <div className="portal-stat" style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('not-started')}>
          <div className="portal-stat__value">{counts['not-started']}</div>
          <div className="portal-stat__label">Not Started</div>
        </div>
      </div>

      {/* Filters */}
      <div className="portal-filters" style={{ marginBottom: 16 }}>
        <input
          className="portal-filters__search"
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="portal-filters__select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="certified">Certified</option>
          <option value="completed">Assessment Passed</option>
          <option value="in-progress">In Progress</option>
          <option value="not-started">Not Started</option>
        </select>
        {(search || filterStatus) && (
          <button
            className="btn btn--secondary"
            style={{ fontSize: 13 }}
            onClick={() => { setSearch(''); setFilterStatus(''); }}
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="portal-card" style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--color-gray-400)' }}>
          No experts match your filters.
        </div>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table training-report-table">
            <thead>
              <tr>
                <th>Expert</th>
                <th>Progress</th>
                <th>Lessons</th>
                <th>Quizzes</th>
                <th>Assessment</th>
                <th>Certificate</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ expert, progress: p }) => (
                <React.Fragment key={expert.id}>
                  <tr
                    className={expanded === expert.id ? 'portal-table__row--active' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === expert.id ? null : expert.id)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>
                        {[expert.first_name, expert.last_name].filter(Boolean).join(' ') || '—'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-gray-400)' }}>{expert.email}</div>
                    </td>

                    {/* Mini progress bar */}
                    <td style={{ minWidth: 130 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--color-gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${p.pct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--color-gray-500)', whiteSpace: 'nowrap' }}>{p.pct}%</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: p.lessonsCompleted === TOTAL_LESSONS ? 700 : 400, color: p.lessonsCompleted === TOTAL_LESSONS ? '#16a34a' : 'inherit' }}>
                        {p.lessonsCompleted}/{TOTAL_LESSONS}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontWeight: p.quizzesPassed === TOTAL_QUIZZES ? 700 : 400, color: p.quizzesPassed === TOTAL_QUIZZES ? '#16a34a' : 'inherit' }}>
                        {p.quizzesPassed}/{TOTAL_QUIZZES}
                      </span>
                    </td>

                    <td>
                      {p.assessmentPassed ? (
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>
                          Passed {p.assessmentScore !== null ? `(${p.assessmentScore}/10)` : ''}
                        </span>
                      ) : p.assessmentScore !== null ? (
                        <span style={{ color: '#dc2626', fontSize: 13 }}>Failed ({p.assessmentScore}/10)</span>
                      ) : (
                        <span style={{ color: 'var(--color-gray-300)' }}>—</span>
                      )}
                    </td>

                    <td>
                      {p.certified ? (
                        <div>
                          <div style={{ color: '#16a34a', fontWeight: 600, fontSize: 13 }}>✓ Issued</div>
                          <div style={{ fontSize: 11, color: 'var(--color-gray-400)' }}>
                            {new Date(p.certDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-gray-300)' }}>—</span>
                      )}
                    </td>

                    <td>
                      <span className={`portal-badge ${STATUS_LABELS[p.status].cls}`}>
                        {STATUS_LABELS[p.status].label}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right', color: 'var(--color-accent)', fontSize: 11 }}>
                      {expanded === expert.id ? '▲' : '▼'}
                    </td>
                  </tr>

                  {/* Expanded detail */}
                  {expanded === expert.id && (
                    <tr>
                      <td colSpan={8} style={{ background: 'var(--color-gray-50)', padding: '20px 24px', borderBottom: '1px solid var(--color-gray-100)' }}>
                        <div className="training-report__detail">

                          {/* Per-unit breakdown */}
                          <div className="training-report__detail-heading">Lesson & Quiz Breakdown</div>
                          <div className="training-report__unit-grid">
                            {UNITS.map((unit) => {
                              const quizPassed = p.passedQuizIds.includes(unit.id);
                              return (
                                <div key={unit.id} className="training-report__unit-card">
                                  <div className="training-report__unit-title">
                                    {unit.title}
                                  </div>
                                  <div className="training-report__lesson-list">
                                    {unit.lessons.map((lid) => {
                                      const done = p.completedLessonIds.includes(lid);
                                      return (
                                        <div key={lid} className="training-report__lesson-row">
                                          <span style={{ color: done ? '#16a34a' : 'var(--color-gray-300)', fontSize: 13, lineHeight: 1 }}>
                                            {done ? '✓' : '○'}
                                          </span>
                                          <span style={{ fontSize: 13, color: done ? 'var(--color-navy)' : 'var(--color-gray-400)' }}>
                                            {lid} — {LESSONS[lid]?.title}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="training-report__quiz-row">
                                    <span style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>Knowledge Check:</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: quizPassed ? '#16a34a' : 'var(--color-gray-400)', marginLeft: 6 }}>
                                      {quizPassed ? '✓ Passed' : 'Not passed'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Assessment & cert */}
                          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
                            <div>
                              <span style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>Final Assessment: </span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: p.assessmentPassed ? '#16a34a' : p.assessmentScore !== null ? '#dc2626' : 'var(--color-gray-400)' }}>
                                {p.assessmentPassed ? `Passed (${p.assessmentScore}/10)` : p.assessmentScore !== null ? `Failed (${p.assessmentScore}/10)` : 'Not taken'}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontSize: 12, color: 'var(--color-gray-500)' }}>Certificate: </span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: p.certified ? '#16a34a' : 'var(--color-gray-400)' }}>
                                {p.certified ? `Issued to "${p.certName}" on ${new Date(p.certDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Not issued'}
                              </span>
                            </div>
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <Link to={`/admin/experts/${expert.id}`} className="btn btn--secondary" style={{ fontSize: 13 }}>
                              View Expert Profile →
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
