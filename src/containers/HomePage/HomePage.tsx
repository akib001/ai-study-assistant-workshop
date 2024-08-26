import { ChatMessages } from '@/components/ChatMessages'
import { MessageBar } from '@/components/MessageBar'
import { Search } from '@/components/Search'
import { ConversationProvider } from '@/contexts/ConversationContext'
import { ChatLayout } from '@/layouts/ChatLayout/Chat.layout'
import { useSearch } from '@/queries/useSearch'
import { populateDirs } from '@/utils/populateDirs.util'
import React, { useEffect, useMemo, useState } from 'react'

export type HomePageProps = React.HTMLProps<HTMLDivElement>

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
  const [query, setQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const search = useSearch(
    { query },
    {
      cacheTime: 0,
      enabled: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      useErrorBoundary: true,
    },
  )

  const fileList = useMemo(
    () => populateDirs(search.data?.files || []),
    [search.data],
  )

  const onSearch = async () => {
    search.refetch()
  }

  useEffect(() => {
    setSelectedFiles([])
  }, [search.data])

  useEffect(() => {
    onSearch()
  }, [])

  return (
    <ConversationProvider>
      <ChatLayout
        messageBar={
          <MessageBar
            hide={selectedFiles.length === 0}
            files={fileList.filter((f) => selectedFiles.includes(f.id))}
            searching={search.isFetching}
          />
        }
      >
        <Search
          searching={search.isFetching}
          query={query}
          onQueryChange={(v) => setQuery(v)}
          onSearch={onSearch}
          results={fileList}
          onSelect={(selected) => setSelectedFiles(selected)}
          selectedFiles={selectedFiles}
        />
        <ChatMessages
          className="py-5"
          files={fileList.filter((f) => selectedFiles.includes(f.id))}
        />
      </ChatLayout>
    </ConversationProvider>
  )
}
