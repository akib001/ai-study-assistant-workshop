export enum RoleType {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type MessageType = {
  id: string
  content: string
  role: RoleType
  childrenId: string
  versionParentId: string | null // Reference to the original message this is a version of
  versionIds: string[]
  activeVersionPosition: number // 1 based index. if 0 then it's the message itself
}
export type ConversationState = {
  messagesById: { [id: string]: MessageType }
  currentPath: string[]
  disableAnimation: boolean
  isGenerating: boolean
}

export enum ConversationActionType {
  ADD_MESSAGE = 'ADD_MESSAGE',
  EDIT_MESSAGE = 'EDIT_MESSAGE',
  SWITCH_VERSION = 'SWITCH_VERSION',
  TOGGLE_GENERATING = 'TOGGLE_GENERATING',
}

export type ConversationAction =
  | {
      type: ConversationActionType.ADD_MESSAGE
      payload: { message: string; role: RoleType }
    }
  | {
      type: ConversationActionType.EDIT_MESSAGE
      payload: { messageId: string; message: string }
    }
  | {
      type: ConversationActionType.SWITCH_VERSION
      payload: { messageId: string; targetVersionIndex: number }
    }
  | {
      type: ConversationActionType.TOGGLE_GENERATING
    }
