import { useConversations } from '@/contexts/ConversationContext'
import { FileData } from '@/types/data.types'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '../ChatMessage'

export type ChatMessagesProps = {
  className?: string
  files: FileData[]
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  files,
  ...props
}) => {
  const conversations = useConversations()
  const ref = useRef<HTMLDivElement>(null)
  const data =
    conversations?.currentPath.map((id) => ({
      id,
      message: conversations.messagesById[id].content,
      role: conversations.messagesById[id].role,
    })) || []

  const messagesRef = useRef(data)

  useEffect(() => {
    if (!ref.current) return
    if (messagesRef.current.length === data.length) return

    messagesRef.current = data
    const parent = ref.current.parentElement

    if (!conversations?.disableAnimation) {
      setTimeout(() => {
        parent?.scrollBy({
          top: parent.scrollHeight,
          behavior: 'smooth',
        })
      }, 1000)
    }
  }, [data, conversations?.disableAnimation])

  return (
    <div
      {...props}
      ref={ref}
      className={clsx(
        'flex flex-col gap-8 w-full overflow-x-hidden',
        props.className,
      )}
    >
      {data.map((message, index) => (
        <ChatMessage
          key={message.id}
          id={message.id}
          role={message.role}
          message={message.message}
          disableAnimation={
            conversations?.disableAnimation || index < data.length - 1
          }
          files={files}
        />
      ))}
    </div>
  )
}
