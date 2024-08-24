import {
  useConversations,
  useConversationsDispatch,
} from '@/contexts/ConversationContext'
import { usePromptSubmit } from '@/hooks/usePromptSubmit.hook'
import { ConversationActionType } from '@/types/conversation.types'
import { FileData } from '@/types/data.types'
import { Avatar, Button, Textarea } from '@nextui-org/react'
import clsx from 'clsx'
import React from 'react'
import { useAnimatedText } from '../AnimatedText'
import { BackArrowIcon } from '../icons/BackArrowIcon'
import { NextArrowIcon } from '../icons/NextArrowIcon'

export type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, 'role'> & {
  id: string
  message: string
  role: 'user' | 'assistant'
  disableAnimation?: boolean
  files: FileData[]
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  message,
  role,
  disableAnimation = false,
  files,
  ...props
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const dispatch = useConversationsDispatch()
  const conversations = useConversations()

  const { textValue, setTextValue, onSubmit } = usePromptSubmit(files, id)

  const content = useAnimatedText(message, {
    maxTime: 1000,
    disabled: role === 'user' || disableAnimation,
  })

  const toggleEditMode = () => {
    setTextValue(message)
    setIsEditing((value) => !value)
  }

  const currentVersionIndex =
    conversations &&
    conversations.messagesById[id].activeVersionPosition === 0 &&
    conversations.messagesById[id].versionParentId == null
      ? conversations.messagesById[id].activeVersionPosition + 1
      : conversations && conversations.messagesById[id].versionParentId != null
        ? conversations?.messagesById[
            conversations.messagesById[id].versionParentId!
          ].activeVersionPosition + 1
        : 0

  const versionLength =
    conversations &&
    conversations.messagesById[id].activeVersionPosition === 0 &&
    conversations.messagesById[id].versionParentId === null
      ? conversations.messagesById[id].versionIds.length + 1
      : conversations && conversations.messagesById[id].versionParentId != null
        ? conversations?.messagesById[
            conversations.messagesById[id].versionParentId!
          ]?.versionIds.length + 1
        : 0

  const onFormSubmit = () => {
    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <div {...props} className={clsx('group', props.className)}>
      <div className="flex flex-row gap-4 items-start">
        <Avatar
          className="flex-shrink-0"
          showFallback
          color={role === 'assistant' ? 'primary' : 'default'}
          name={role === 'assistant' ? 'A' : ''}
          classNames={{
            name: 'text-[16px]',
          }}
        />
        <div className="flex-grow relative border border-gray-200 rounded-lg p-4 text-md bg-white shadow-sm mt-[-4px]">
          {isEditing && role !== 'assistant' ? (
            <div>
              <Textarea
                label="Description"
                placeholder="Enter your description"
                className=""
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={toggleEditMode}
                  className="ml-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={onFormSubmit}
                  size="sm"
                  className=""
                >
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {role !== 'assistant' && !isEditing && (
            <div className="flex items-center gap-1 absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button size="sm" onClick={toggleEditMode} className=" ">
                Edit
              </Button>
              {/* it means it has versions */}
              {conversations &&
                (conversations.messagesById[id].activeVersionPosition === 0 &&
                conversations.messagesById[id].versionParentId == null
                  ? conversations.messagesById[id].versionIds.length > 0
                  : conversations.messagesById[id].versionParentId != null) && (
                  <>
                    <Button
                      size="sm"
                      variant="light"
                      radius="md"
                      className="px-1 min-w-1"
                      disabled={
                        conversations.messagesById[id].versionParentId == null
                      }
                      onClick={() => {
                        if (
                          dispatch &&
                          conversations.messagesById[id].versionParentId !==
                            null
                        )
                          dispatch({
                            type: ConversationActionType.SWITCH_VERSION,
                            payload: {
                              messageId: id,
                              targetVersion:
                                conversations.messagesById[
                                  conversations.messagesById[id]
                                    .versionParentId!
                                ].activeVersionPosition - 1,
                            },
                          })
                      }}
                    >
                      <BackArrowIcon />
                    </Button>
                    <span className="text-md">
                      {currentVersionIndex} / {versionLength}{' '}
                    </span>

                    <Button
                      size="sm"
                      variant="light"
                      radius="md"
                      className="px-1 min-w-1"
                      disabled={versionLength === currentVersionIndex}
                      onClick={() => {
                        if (dispatch)
                          dispatch({
                            type: ConversationActionType.SWITCH_VERSION,
                            payload: {
                              messageId: id,
                              targetVersion:
                                conversations.messagesById[id]
                                  .activeVersionPosition === 0 &&
                                conversations.messagesById[id]
                                  .versionParentId == null
                                  ? conversations.messagesById[id]
                                      .activeVersionPosition + 1
                                  : conversations.messagesById[
                                      conversations.messagesById[id]
                                        .versionParentId!
                                    ].activeVersionPosition + 1,
                            },
                          })
                      }}
                    >
                      <NextArrowIcon />
                    </Button>
                  </>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
