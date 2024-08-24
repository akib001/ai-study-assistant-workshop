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
      // TODO: need to refactor newContent to message
      const { messageId, message: newContent } = action.payload

      const nextVersionIndex =
        state.messagesById[messageId].activeVersionPosition === 0 &&
        state.messagesById[messageId].versionParentId == null
          ? state.messagesById[messageId].versionIds.length + 1
          : state.messagesById[messageId].versionParentId != null
            ? state?.messagesById[
                state.messagesById[messageId].versionParentId!
              ]?.versionIds.length + 1
            : 0

      const parentMessage =
        nextVersionIndex === 1
          ? state.messagesById[messageId]
          : state.messagesById[
              state.messagesById[messageId].versionParentId || messageId
            ]
      // refactor letter
      if (!parentMessage) return state

      const newId = generateId()
      const newMessage: MessageType = {
        role: parentMessage.role,
        id: newId,
        content: newContent,
        childrenId: '',
        versionParentId: parentMessage.id, // could be null
        versionIds: [],
        activeVersionPosition: 0,
      }

      let updatedState = {
        ...state,
        messagesById: {
          ...state.messagesById,
          [newId]: newMessage,
          [parentMessage.id]: {
            ...parentMessage,
            versionIds: [...parentMessage.versionIds, newId],
            activeVersionPosition: parentMessage.versionIds.length + 1,
          },
        },
        disableAnimation: false,
      }

      const messageIndex = state.currentPath.indexOf(messageId)
      if (messageIndex !== -1) {
        updatedState.currentPath = [
          ...state.currentPath.slice(0, messageIndex),
          newId,
        ]
      }

      return updatedState
    }

    case ConversationActionType.SWITCH_VERSION: {
      const { messageId, targetVersion } = action.payload // TODO: targetVersionIndex must be 0 indexed

      const message = state.messagesById[messageId]
      if (!message) return state

      const versionParentId = message.versionParentId || messageId
      const versionParent = state.messagesById[versionParentId]

      if (!versionParent) return state

      const targetMessageId =
        targetVersion === 0
          ? versionParentId
          : versionParent.versionIds[targetVersion - 1] // TODO: targetVersion needs to be 1 indexed

      if (!targetMessageId) return state

      const messageIndex = state.currentPath.indexOf(messageId) // cloud be not found
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
            activeVersionPosition: targetVersion,
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
