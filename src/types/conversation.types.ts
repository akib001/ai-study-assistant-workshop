export enum RoleType {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type MessageType = {
  id: string
  content: string // The message content
  role: RoleType
  childrenId: string // Reference to the next message in the conversation
  versionParentId: string | null // Reference to the original message this is a version of
  versionIds: string[] // List of version ids. If there is no version then it's an empty array
  activeVersionPosition: number // The index of the active version in the versionIds array. If it's the original message then it's 0. If it's the first version then it's 1, and so on. And it is used for preserving the active version when switching between messages. I noticed chatgpt doesn't preserve the active version when switching between messages, so I added this feature
}
export type ConversationState = {
  messagesById: { [id: string]: MessageType } // Map of message id to message
  currentPath: string[] // List of message ids that are currently being viewed. If the edit version is switched, the path will be updated
  disableAnimation: boolean // Whether to disable animations. This used to prevent animations like when assistant is generating a edited version response, or assistant is generating a response
  isGenerating: boolean // Whether the assistant is currently generating a response. Moved isGenerating state from HomePage to context to make it easier to manage
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
