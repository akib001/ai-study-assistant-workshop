import React from 'react'

export type NextArrowIconProps = React.SVGAttributes<SVGElement>

export const NextArrowIcon: React.FC<NextArrowIconProps> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      width="24px"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M9.293 18.707a1 1 0 0 1 0-1.414L14.586 12 9.293 6.707a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414 0"
        clip-rule="evenodd"
      ></path>
    </svg>
  )
}
