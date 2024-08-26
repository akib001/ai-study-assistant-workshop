import {
  ConversationAction,
  ConversationActionType,
  ConversationState,
  MessageType,
} from '@/types/conversation.types'
import { generateId } from '@/utils/generateId.utils'

export const conversationsReducer = (
  state: ConversationState,
  action: ConversationAction,
): ConversationState => {
  switch (action.type) {
    case ConversationActionType.ADD_MESSAGE: {
      const { message: content, role } = action.payload
      const newId = generateId()
      const newMessage: MessageType = {
        id: newId,
        content,
        role,
        childrenId: '',
        versionParentId: null,
        versionIds: [],
        activeVersionPosition: 0,
      }

      let updatedState = {
        ...state,
        messagesById: {
          ...state.messagesById,
          [newId]: newMessage,
        },
        currentPath: [...state.currentPath, newId],
        disableAnimation: false,
      }

      if (state.currentPath.length > 0) {
        const parentId = state.currentPath[state.currentPath.length - 1]
        updatedState.messagesById[parentId] = {
          ...updatedState.messagesById[parentId],
          childrenId: newId,
        }
      }

      return updatedState
    }
    case ConversationActionType.EDIT_MESSAGE: {
      const { messageId, message: newContent } = action.payload

      const currentMessage = state.messagesById[messageId]
      const isOriginalMessage =
        currentMessage.activeVersionPosition === 0 &&
        !currentMessage.versionParentId

      const nextVersionIndex = isOriginalMessage
        ? currentMessage.versionIds.length + 1
        : state.messagesById[currentMessage.versionParentId!]?.versionIds
            .length + 1 || 0

      const parentMessageId = isOriginalMessage
        ? messageId
        : currentMessage.versionParentId || messageId
      const parentMessage = state.messagesById[parentMessageId]

      if (!parentMessage) return state

      const newMessageId = generateId()
      const newMessage = {
        role: parentMessage.role,
        id: newMessageId,
        content: newContent,
        childrenId: '',
        versionParentId: parentMessage.id,
        versionIds: [],
        activeVersionPosition: 0,
      }

      const updatedMessagesById = {
        ...state.messagesById,
        [newMessageId]: newMessage,
        [parentMessage.id]: {
          ...parentMessage,
          versionIds: [...parentMessage.versionIds, newMessageId],
          activeVersionPosition: nextVersionIndex,
        },
      }

      const messageIndex = state.currentPath.indexOf(messageId)
      const updatedCurrentPath =
        messageIndex !== -1
          ? [...state.currentPath.slice(0, messageIndex), newMessageId]
          : state.currentPath

      return {
        ...state,
        messagesById: updatedMessagesById,
        currentPath: updatedCurrentPath,
        disableAnimation: false,
      }
    }

    case ConversationActionType.SWITCH_VERSION: {
      const { messageId, targetVersionIndex } = action.payload

      const message = state.messagesById[messageId]
      if (!message) return state

      const versionParentId = message.versionParentId || messageId
      const versionParent = state.messagesById[versionParentId]

      if (!versionParent) return state

      const targetMessageId =
        targetVersionIndex === 0
          ? versionParentId
          : versionParent.versionIds[targetVersionIndex - 1]

      if (!targetMessageId) return state

      const messageIndex = state.currentPath.indexOf(messageId)
      if (messageIndex === -1) return state

      // Preserve the downstream messages
      const downstreamPath = getDownstreamPath(state, targetMessageId)

      const newPath = [
        ...state.currentPath.slice(0, messageIndex),
        targetMessageId,
        ...downstreamPath,
      ]

      return {
        ...state,
        messagesById: {
          ...state.messagesById,
          [versionParentId]: {
            ...versionParent,
            activeVersionPosition: targetVersionIndex,
          },
        },
        currentPath: newPath,
        disableAnimation: true,
      }
    }

    case ConversationActionType.TOGGLE_GENERATING:
      return {
        ...state,
        isGenerating: !state.isGenerating,
      }
    default:
      return state
  }
}

function getDownstreamPath(
  state: ConversationState,
  startMessageId: string,
): string[] {
  const path: string[] = []
  let currentId = startMessageId

  while (true) {
    const currentMessage = state.messagesById[currentId]
    if (!currentMessage || !currentMessage.childrenId) break
    let nextMessage = state.messagesById[currentMessage.childrenId]
    currentId =
      nextMessage.activeVersionPosition > 0
        ? nextMessage.versionIds[nextMessage.activeVersionPosition - 1]
        : nextMessage.id

    path.push(currentId)
  }

  return path
}
