import React from 'react'

export type VideoFilterIconProps = React.SVGAttributes<SVGElement>

export const VideoFilterIcon: React.FC<VideoFilterIconProps> = ({
  ...props
}) => {
  return (
    <svg
      height="24px"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M160 0h512l256 256v704c0 35.3472-28.6528 64-64 64H160c-35.3472 0-64-28.6528-64-64V64c0-35.3472 28.6528-64 64-64z"
        fill="#7C8EEE"
      />
      <path
        d="M702.2976 579.2896l-298.5664 177.984c-19.9488 12.0192-45.3312-2.4128-45.3312-25.856v-355.968c0-22.848 25.3824-37.2736 45.3312-25.856l298.56 177.984c19.3408 12.032 19.3408 40.288 0 51.712z"
        fill="#FFFFFF"
      />
      <path
        d="M672 0l256 256h-192c-35.3472 0-64-28.6528-64-64V0z"
        fill="#CAD1F8"
      />
    </svg>
  )
}
