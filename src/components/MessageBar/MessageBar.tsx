import { useConversations } from '@/contexts/ConversationContext'
import { usePromptSubmit } from '@/hooks/usePromptSubmit.hook'
import { FileData } from '@/types/data.types'
import { Button, TextAreaProps, Textarea } from '@nextui-org/react'
import clsx from 'clsx'
import React, { memo } from 'react'
import { SendIcon } from '../icons/SendIcon'

export type MessageBarProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'onSubmit'
> & {
  hide?: boolean
  files: FileData[]
  textareaProps?: TextAreaProps
  searching?: boolean
}

export const MessageBar: React.FC<MessageBarProps> = memo(
  ({ hide, files, searching = false, textareaProps = {}, ...props }) => {
    const { isGenerating } = useConversations()

    const { textValue, setTextValue, onSubmit } = usePromptSubmit(files)

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (onSubmit) {
        onSubmit()
      }
    }

    return (
      <div
        {...props}
        className={clsx(
          'pb-2',
          'transition',
          'translate-y-0',
          'opacity-100',
          hide && ['opacity-0', 'invisible', 'translate-y-full'],
          props.className,
        )}
      >
        <form className="flex flex-row gap-2 items-end" onSubmit={onFormSubmit}>
          <Textarea
            size="lg"
            minRows={1}
            maxRows={8}
            value={textValue}
            placeholder="Type a message..."
            classNames={{
              inputWrapper: 'border-gray-100 hover:border-gray-100',
            }}
            onValueChange={(value) => setTextValue(value)}
            isDisabled={isGenerating}
            {...textareaProps}
            className={clsx(textareaProps.className)}
          />

          <Button
            className=""
            isIconOnly
            color="primary"
            size="lg"
            type="submit"
            isDisabled={
              isGenerating ||
              textValue?.replaceAll('\n', '').trim().length === 0 ||
              searching
            }
            isLoading={isGenerating}
          >
            <SendIcon className="fill-white" />
          </Button>
        </form>
      </div>
    )
  },
)
