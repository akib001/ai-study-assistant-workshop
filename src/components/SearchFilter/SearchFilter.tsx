import { FileData, FileType } from '@/types/data.types'
import { Chip } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import {
  AudioFileIcon,
  DraftIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'

export type SearchFilterProps = {
  filteredFileTypes: Set<FileType>
  onFilteredFileTypesChange: React.Dispatch<React.SetStateAction<Set<FileType>>>
  selected?: string[]
  onSelect?: (selected: string[]) => void
  map: Record<string, FileData>
}

const iconMap: Record<
  Exclude<FileType, 'folder'>,
  { icon: React.FC<any>; label: string }
> = {
  document: {
    icon: DraftIcon,
    label: 'Docs',
  },
  pdf: {
    icon: PdfFileIcon,
    label: 'PDF',
  },
  image: {
    icon: ImageIcon,
    label: 'Images',
  },
  audio: {
    icon: AudioFileIcon,
    label: 'MP3/Audio',
  },
  video: {
    icon: VideoFileIcon,
    label: 'MP4/Video',
  },
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filteredFileTypes = new Set(),
  onFilteredFileTypesChange,
  selected = [] as string[],
  onSelect,
  map,
}) => {
  const handleChipClick = useCallback(
    (key: FileType) => {
      let updatedFilteredFileTypes = new Set(filteredFileTypes)
      if (updatedFilteredFileTypes.has(key)) {
        updatedFilteredFileTypes.delete(key)
      } else {
        updatedFilteredFileTypes.add(key)
      }

      onFilteredFileTypesChange(updatedFilteredFileTypes)

      onSelect &&
        onSelect(
          selected.filter(
            (id) =>
              updatedFilteredFileTypes.size === 0 ||
              updatedFilteredFileTypes.has(map[id].type),
          ),
        )
    },
    [onFilteredFileTypesChange, selected, onSelect, map, filteredFileTypes],
  )

  return (
    <div className="flex justify-center gap-4">
      {(Object.keys(iconMap) as Array<keyof typeof iconMap>).map((key) => {
        const IconComponent = iconMap[key].icon
        return (
          <Chip
            key={key}
            startContent={
              <IconComponent
                className={clsx(
                  'fill-primary',
                  filteredFileTypes.has(key) && 'fill-white',
                )}
              />
            }
            onClick={() => handleChipClick(key)}
            variant="shadow"
            className={clsx(
              'py-[20px] px-[16px] bg-white text-gray-800 cursor-pointer',
              filteredFileTypes.has(key) && 'bg-primary text-white',
            )}
          >
            {iconMap[key].label}
          </Chip>
        )
      })}
    </div>
  )
}
