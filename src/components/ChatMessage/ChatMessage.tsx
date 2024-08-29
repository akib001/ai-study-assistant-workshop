import {
  useConversations,
  useConversationsDispatch,
} from '@/contexts/ConversationContext'
import { usePromptSubmit } from '@/hooks/usePromptSubmit.hook'
import {
  ConversationActionType,
  ConversationState,
} from '@/types/conversation.types'
import { FileData } from '@/types/data.types'
import { Avatar, Button, Textarea } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { useAnimatedText } from '../AnimatedText'
import { BackArrowIcon } from '../icons/BackArrowIcon'
import { NextArrowIcon } from '../icons/NextArrowIcon'

function getVersionInfo(conversations: ConversationState, id: string) {
  const message = conversations.messagesById[id]
  const isOriginalMessage =
    message.activeVersionPosition === 0 && message.versionParentId == null
  const parentMessage = message.versionParentId
    ? conversations.messagesById[message.versionParentId]
    : message

  const currentVersionPosition = isOriginalMessage
    ? message.activeVersionPosition + 1
    : parentMessage.activeVersionPosition + 1

  const versionLength = isOriginalMessage
    ? message.versionIds.length + 1
    : parentMessage.versionIds.length + 1

  return { currentVersionPosition, versionLength }
}

type ChatMessageProps = Omit<React.HTMLProps<HTMLDivElement>, 'role'> & {
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

  const { currentVersionPosition, versionLength } = useMemo(
    () => getVersionInfo(conversations, id),
    [conversations, id],
  )

  const onFormSubmit = () => {
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleSwitchVersion = (targetVersionIndex: number) => {
    if (dispatch) {
      dispatch({
        type: ConversationActionType.SWITCH_VERSION,
        payload: { messageId: id, targetVersionIndex },
      })
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
        <div className="flex-grow relative border border-gray-200 rounded-lg p-4  bg-white shadow-sm mt-[-4px]">
          {isEditing && role !== 'assistant' ? (
            <div>
              <Textarea
                size="lg"
                maxRows={8}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={toggleEditMode}
                  className="ml-auto"
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onClick={onFormSubmit}
                  isDisabled={
                    textValue?.replaceAll('\n', '').trim().length === 0 ||
                    conversations.isGenerating
                  }
                  size="sm"
                  aria-label="Save"
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
              {currentVersionPosition > 0 && versionLength > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="light"
                    radius="md"
                    className="px-1 min-w-1"
                    isDisabled={
                      currentVersionPosition === 1 || conversations.isGenerating
                    }
                    onClick={() =>
                      handleSwitchVersion(currentVersionPosition - 2)
                    }
                    aria-label="Previous"
                  >
                    <BackArrowIcon />
                  </Button>
                  <span className="text-md">
                    {currentVersionPosition} / {versionLength}
                  </span>

                  <Button
                    size="sm"
                    variant="light"
                    radius="md"
                    className="px-1 min-w-1"
                    isDisabled={
                      versionLength === currentVersionPosition ||
                      conversations.isGenerating
                    }
                    onClick={() => handleSwitchVersion(currentVersionPosition)}
                    aria-label="Next"
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
