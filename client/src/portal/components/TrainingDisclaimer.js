import React from 'react'

export default function TrainingDisclaimer() {
  return (
    <div className="training-disclaimer">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        width="16"
        height="16"
        className="training-disclaimer__icon"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <p className="training-disclaimer__text">
        These training materials are provided by Veracity Expert Witness LLC for
        educational and informational purposes only. They do not constitute
        legal advice, and Veracity Expert Witness LLC assumes no liability for
        how this content is applied. You remain solely responsible for your own
        professional conduct and testimony.
      </p>
    </div>
  )
}
