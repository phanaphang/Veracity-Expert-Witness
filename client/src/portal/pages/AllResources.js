import React from 'react';
import { Link } from 'react-router-dom';
import TrainingDisclaimer from '../components/TrainingDisclaimer';

const MODULES = [
  {
    title: 'Expert Witness Foundations',
    description: '5 reference guides covering CV preparation, deposition prep, California rules, fee disclosure, and a full lesson summary.',
    to: '/training/resources',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
    count: 5,
  },
  {
    title: 'Standards of Admissibility',
    description: '5 reference guides covering Frye vs. Kelly vs. Daubert, California admissibility checklists, federal Daubert preparation, state-by-state standards, and a full module summary.',
    to: '/training/admissibility/resources',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    count: 5,
  },
  {
    title: 'Report Writing',
    description: '4 reference guides covering report structure, opinion writing, methodology & deposition defense, and a full module summary.',
    to: '/training/report-writing/resources',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    count: 4,
  },
  {
    title: 'Deposition',
    description: '4 reference guides covering deposition preparation, answering techniques, common traps & counter-strategies, and a full module summary.',
    to: '/training/deposition/resources',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    count: 4,
  },
  {
    title: 'Trial Testimony',
    description: '4 reference guides covering trial preparation, cross-examination survival, jury communication tips, and a full module summary.',
    to: '/training/trial-testimony/resources',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0l-3-3m-9 3l3-3m0 0h6',
    count: 4,
  },
];

export default function AllResources() {
  return (
    <div>
      <div className="portal-page__header">
        <h1 className="portal-page__title">All Training Resources</h1>
        <p className="portal-page__subtitle">
          {MODULES.reduce((sum, m) => sum + m.count, 0)} downloadable reference guides across {MODULES.length} training modules
        </p>
      </div>

      <TrainingDisclaimer />

      <div className="training-resources">
        {MODULES.map((mod) => (
          <Link
            key={mod.to}
            to={mod.to}
            className="portal-card training-resource-card"
            style={{ textDecoration: 'none' }}
          >
            <div className="training-resource-card__icon">
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path d={mod.icon} stroke="var(--color-navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="training-resource-card__body">
              <h2 className="training-resource-card__title">{mod.title}</h2>
              <p className="training-resource-card__desc">{mod.description}</p>
            </div>
            <span className="btn btn--secondary training-resource-card__btn">
              {mod.count} Resources →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
