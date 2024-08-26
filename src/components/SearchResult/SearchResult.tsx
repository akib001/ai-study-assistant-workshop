import { FileData, FileType } from '@/types/data.types'
import { Accordion, AccordionItem, Checkbox, Divider } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { ContextPanel } from '../ContextPanel/ContextPanel'
import { FileCard } from '../FileCard'
import { FolderCard } from '../FolderCard'
import { SearchFilter } from '../SearchFilter'
import {
  AudioFileIcon,
  DraftIcon,
  FolderIcon,
  ImageIcon,
  PdfFileIcon,
  VideoFileIcon,
} from '../icons'

const iconMap = {
  folder: FolderIcon,
  pdf: PdfFileIcon,
  document: DraftIcon,
  video: VideoFileIcon,
  audio: AudioFileIcon,
  image: ImageIcon,
}

export type SearchResultProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'selected' | 'onSelect' | 'title'
> & {
  title?: React.ReactNode
  description?: React.ReactNode

  files?: FileData[]
  selected?: string[]
  onSelect?: (selected: string[]) => void

  hideList?: boolean
  compactOverview?: boolean
  isSearching?: boolean
}

export const SearchResult: React.FC<SearchResultProps> = ({
  title,
  description,
  selected = [] as string[],
  onSelect,
  files = [],
  className,
  hideList = false,
  compactOverview = false,
  isSearching = false,
  ...props
}) => {
  const [filteredFileTypes, setFilteredFileTypes] = React.useState<
    Set<FileType>
  >(() => new Set())

  const map: Record<string, FileData> = useMemo(
    () =>
      Object.fromEntries(
        files
          .filter(
            (file) =>
              !filteredFileTypes.size ||
              file.type === 'folder' ||
              filteredFileTypes.has(file.type),
          )
          .map((file) => [file.id, file]),
      ),
    [files, selected, filteredFileTypes],
  )

  const [directoriesGroup, filesGroup] = useMemo(
    () => [
      files
        .filter(
          (f) =>
            f.type === 'folder' &&
            (!filteredFileTypes.size ||
              f.children?.some((child) => filteredFileTypes.has(child.type))),
        )
        .map((folder) => ({
          ...folder,
          children: folder.children?.filter(
            (child) =>
              !filteredFileTypes.size || filteredFileTypes.has(child.type),
          ),
        })),
      files.filter(
        (f) =>
          f.type !== 'folder' &&
          (!filteredFileTypes.size || filteredFileTypes.has(f.type)),
      ),
    ],
    [files, map, filteredFileTypes],
  )

  const onSelectionChange = (newValue: string[]) => {
    if (onSelect) onSelect(newValue)
  }

  const isItemSelected = (id: string) => {
    const { type, children = [] } = map[id]
    const ids = type === 'folder' ? children.map((child) => child.id) : [id]

    return ids.every((id) => selected.includes(id))
  }

  const onCheckboxChange = (id: string) => {
    const item = map[id]
    const isSelected = isItemSelected(id)

    if (item.type === 'folder') {
      const children = item.children || []

      const newSelected = isSelected
        ? selected.filter(
            (item) => !children.map((child) => child.id).includes(item),
          )
        : Array.from(
            new Set([
              ...selected,
              ...children
                .filter(
                  (child) =>
                    !filteredFileTypes.size ||
                    filteredFileTypes.has(child.type),
                )
                .map((child) => child.id),
            ]),
          )

      onSelectionChange(newSelected)
    } else {
      const newSelected = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]

      onSelectionChange(newSelected)
    }
  }

  return (
    <>
      {!compactOverview && (
        <SearchFilter
          filteredFileTypes={filteredFileTypes}
          onFilteredFileTypesChange={setFilteredFileTypes}
          selected={selected}
          onSelect={onSelect}
          map={map}
          disableFilter={files?.length <= 0 || isSearching}
        />
      )}

      <div className={clsx('relative', className)} {...props}>
        <div>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <div className="py-2 pb-8">
            <ContextPanel
              map={map}
              selected={selected}
              compact={compactOverview}
              className={clsx(
                'duration-300',
                'absolute right-0 w-full transition',
                !compactOverview && 'translate-y-0',
                compactOverview && 'translate-y-[-50px]',
              )}
              filteredFileTypes={filteredFileTypes}
            />
          </div>
        </div>
        <div className="mt-8">
          <Accordion
            isCompact
            hideIndicator
            keepContentMounted
            selectedKeys={!hideList ? ['root-tree'] : []}
          >
            <AccordionItem
              title={null}
              key="root-tree"
              HeadingComponent={() => <></>}
            >
              <div className={clsx('max-h-[500px] overflow-y-auto')}>
                {directoriesGroup.map((item, index) => (
                  <div key={index}>
                    <div className={clsx('flex flex-row items-center')}>
                      <FolderCard
                        name={item.name}
                        label={[
                          'Folder',
                          `${(item.children || []).length} items`,
                        ]}
                        selectedKeys={[]}
                        itemProps={{
                          onPress: () => onCheckboxChange(item.id),
                          startContent: (
                            <>
                              <Checkbox
                                className="pe-[16px]"
                                isSelected={isItemSelected(item.id)}
                                onValueChange={() => onCheckboxChange(item.id)}
                              />
                            </>
                          ),
                          hideIndicator: true,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Divider className="my-2" />

                {filesGroup.map((item, index) => {
                  const IconComponent = iconMap[item.type]

                  return (
                    <div key={index}>
                      <div className={clsx('flex flex-row items-center')}>
                        <FileCard
                          name={item.name}
                          tags={item.tags}
                          excerpt={item.excerpt}
                          itemProps={{
                            onPress: () => onCheckboxChange(item.id),
                            startContent: (
                              <>
                                <Checkbox
                                  className="pe-[16px]"
                                  isSelected={isItemSelected(item.id)}
                                  onValueChange={() =>
                                    onCheckboxChange(item.id)
                                  }
                                />
                              </>
                            ),
                          }}
                          icon={<IconComponent />}
                          extension={item.extension || ''}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  )
}
