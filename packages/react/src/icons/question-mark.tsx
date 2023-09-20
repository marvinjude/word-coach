import React from 'react'

function QuestionMark() {
  return (
    <svg
      aria-label="Skipped question"
      height="20px"
      viewBox="0 0 20 20"
      width="20px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g>
          <polygon points="0 0 20 0 20 20 0 20"></polygon>
          <path
            fill="currentColor"
            d="M10,5 C7.928125,5 6,7.03616001 6,9 L8,9 C8,8.02252308 8.96875,6.77723076 10,6.77723076 C11.03125,6.77723076 12.125,7.32252327 12.125,8.30000019 C12.125,10.0772309 9,9.61200002 9,12.5 L11,12.5 C11,10.5006154 14,10.7215384 14,8.5 C14,6.53616001 12.071875,5 10,5 Z"
            fillRule="nonzero"
          ></path>
          <polygon fill="currentColor" points="9 16 11 16 11 14 9 14"></polygon>
        </g>
      </g>
    </svg>
  )
}

export default QuestionMark
