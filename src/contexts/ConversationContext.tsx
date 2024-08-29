import {
  ConversationAction,
  ConversationState,
} from '@/types/conversation.types'
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react'
import { conversationsReducer } from './conversations.reducer'

const initialState: ConversationState = {
  messagesById: {},
  currentPath: [],
  isGenerating: false,
  disableAnimation: false,
}

const ConversationContext = createContext<ConversationState>(initialState)

const ConversationDispatchContext =
  createContext<Dispatch<ConversationAction> | null>(null)

type ConversationProviderProps = {
  children: ReactNode
}

export const ConversationProvider = ({
  children,
}: ConversationProviderProps) => {
  const [conversations, dispatch] = useReducer(
    conversationsReducer,
    initialState,
  )

  return (
    <ConversationContext.Provider value={conversations}>
      <ConversationDispatchContext.Provider value={dispatch}>
        {children}
      </ConversationDispatchContext.Provider>
    </ConversationContext.Provider>
  )
}

export function useConversations() {
  return useContext(ConversationContext)
}

export function useConversationsDispatch() {
  return useContext(ConversationDispatchContext)
}
