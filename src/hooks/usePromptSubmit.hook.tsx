import {
  useConversations,
  useConversationsDispatch,
} from '@/contexts/ConversationContext'
import { chatApi } from '@/services/api'
import { ConversationActionType, RoleType } from '@/types/conversation.types'
import { FileData } from '@/types/data.types'
import { useState } from 'react'

export const usePromptSubmit = (
  files: FileData[],
  messageIdForEdit: null | string = null,
) => {
  const [textValue, setTextValue] = useState('')

  const conversations = useConversations()
  const dispatch = useConversationsDispatch()

  const onSubmit = async () => {
    if (dispatch && textValue) {
      dispatch({ type: ConversationActionType.TOGGLE_GENERATING })

      if (!messageIdForEdit) {
        dispatch({
          type: ConversationActionType.ADD_MESSAGE,
          payload: {
            message: textValue,
            role: RoleType.USER,
          },
        })
      } else if (messageIdForEdit) {
        dispatch({
          type: ConversationActionType.EDIT_MESSAGE,
          payload: {
            message: textValue,
            messageId: messageIdForEdit,
          },
        })
      }

      const { message } = await chatApi({
        prompt: textValue,
        files,
        history:
          conversations.currentPath.map((id) => ({
            message: conversations.messagesById[id].content,
            role: conversations.messagesById[id].role,
          })) || [],
      })

      dispatch({
        type: ConversationActionType.ADD_MESSAGE,
        payload: {
          message: message.message,
          role: RoleType.ASSISTANT,
        },
      })

      setTextValue('')
      dispatch({ type: ConversationActionType.TOGGLE_GENERATING })
    }
  }

  return { textValue, setTextValue, onSubmit }
}
