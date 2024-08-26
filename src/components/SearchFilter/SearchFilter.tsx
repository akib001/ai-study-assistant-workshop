import { FileData, FileType } from '@/types/data.types'
import { Chip } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { AudioFilterIcon, DocsFilterIcon, VideoFilterIcon } from '../icons'
import { ImageFilterIcon } from '../icons/ImageFilterIcon'
import { PdfFilterIcon } from '../icons/PdfFilterIcon'

export type SearchFilterProps = {
  filteredFileTypes: Set<FileType>
  onFilteredFileTypesChange: React.Dispatch<React.SetStateAction<Set<FileType>>>
  selected?: string[]
  onSelect?: (selected: string[]) => void
  map: Record<string, FileData>
  disableFilter?: boolean
}

const iconMap: Record<
  Exclude<FileType, 'folder'>,
  { icon: React.FC<any>; label: string }
> = {
  document: {
    icon: DocsFilterIcon,
    label: 'Docs',
  },
  pdf: {
    icon: PdfFilterIcon,
    label: 'PDF',
  },
  image: {
    icon: ImageFilterIcon,
    label: 'Images',
  },
  audio: {
    icon: AudioFilterIcon,
    label: 'MP3/Audio',
  },
  video: {
    icon: VideoFilterIcon,
    label: 'MP4/Video',
  },
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filteredFileTypes = new Set(),
  onFilteredFileTypesChange,
  selected = [] as string[],
  onSelect,
  map,
  disableFilter = false,
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
    <div className="flex justify-center gap-4 mb-10">
      {(Object.keys(iconMap) as Array<keyof typeof iconMap>).map((key) => {
        const IconComponent = iconMap[key].icon
        return (
          <Chip
            key={key}
            startContent={<IconComponent className={'mr-[6px]'} />}
            onClick={() => handleChipClick(key)}
            variant="shadow"
            isDisabled={disableFilter}
            className={clsx(
              'py-5 px-4 bg-white text-medium text-foreground-500 cursor-pointer',
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
