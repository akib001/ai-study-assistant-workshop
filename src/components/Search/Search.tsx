import { AnimatedText } from '@/components/AnimatedText'
import { SearchBar } from '@/components/SearchBar'
import { useConversations } from '@/contexts/ConversationContext'
import clsx from 'clsx'
import React from 'react'
import { SearchResult, SearchResultProps } from '../SearchResult'

export type SearchProps = {
  query?: string
  onQueryChange?: (query: string) => void

  searching?: boolean
  results?: SearchResultProps['files']
  onSearch?: (query: string) => void

  selectedFiles?: SearchResultProps['selected']
  onSelect?: SearchResultProps['onSelect']
}

export const Search: React.FC<SearchProps> = ({
  query,
  onQueryChange,
  searching,
  results,
  onSearch,
  selectedFiles,
  onSelect,
}) => {
  const { currentPath } = useConversations()

  const compact = (currentPath || []).length > 0

  return (
    <div className="flex flex-col">
      <SearchBar
        className={clsx(
          'transition',
          'mb-7',
          compact && ['opacity-0', 'invisible', 'h-0', 'mb-0'],
        )}
        value={query}
        pending={searching}
        onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
        onSubmit={() => {
          onSearch && onSearch(query || '')
        }}
      />
      <div>
        {typeof results !== 'undefined' && (
          <SearchResult
            title={
              <div className="flex flex-row items-center gap-2">
                <AnimatedText
                  maxTime={500}
                  text={compact ? query! : 'Search results'}
                />
              </div>
            }
            description={
              <AnimatedText
                maxTime={500}
                text={
                  compact
                    ? `Ask me anything to help with your studies!`
                    : `Select at least one file to start a new conversation.`
                }
              />
            }
            selected={selectedFiles}
            isSearching={searching}
            onSelect={onSelect}
            files={results}
            hideList={compact}
            compactOverview={compact}
          />
        )}
      </div>
    </div>
  )
}
