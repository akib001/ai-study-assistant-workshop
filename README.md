# Unbody Chatbot Enhancement Project

## Live Demo

[Unbody Chatbot](https://unbody-chatbot.netlify.app)

## Project Setup

This is a Next.js project. To set it up locally, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies using `yarn install`.
3. Create a project on Unbody:
   - Enable all AI features except for the image vectorizer.
   - Connect a folder with dummy content from your Google Drive.
4. Create an API key and set up the following environment variables:
   - `NEXT_PUBLIC_UNBODY_API_KEY=[your API key]`
   - `NEXT_PUBLIC_UNBODY_PROJECT_ID=[your project ID]`
5. Run the project locally using `yarn dev`.

## Task 1: Enhance Search Functionality

**Objective**: Implement filters based on file type to refine search results

### Approach:

1. Ran the project with necessary credentials and reviewed the codebase.
2. Determined features to implement and functionality to follow, adhering to industry best practices.
3. Identified edge cases, such as handling file selection when changing filters.
4. Implemented the coding changes.
5. Conducted UI testing to identify bugs and edge cases.
6. Performed code refactoring.
7. Attempted to find suitable icons, ultimately deciding to use existing ones.

### Changes:

- **SearchResult.tsx**:
  - Added state to store selected filter types
  - Modified existing logic
  - Integrated a new component
- **SearchFilter.tsx**:
  - Created a new icon map for future use
  - Implemented logic for filter type selection and file preservation
- **MessageBar.tsx**:
  - Disabled Submit prompt button during search
- Refactored existing code for improved performance

**Time taken**: [Insert time here]

## Task 2: Enhance Chat Functionality

**Objective**: Add the ability to edit a message and start a new chat from there

### Approach:

1. Studied ChatGPT and Claude interfaces for design inspiration.
2. Planned and sketched the design, deciding on button placement:
   - Analyzed the existing UI and available space
   - Considered placing the edit button on the left side of each message card
   - Due to space constraints, decided to position the edit button at the bottom right corner, similar to Claude's interface
   - Acknowledged that this differs from ChatGPT's interface, but prioritized usability within the existing layout
3. Developed a coding strategy based on requirements.
4. Designed a tree-like state structure for version management:
   - Researched ChatGPT's edit and version switching functionality
   - Decided to use tree like data structure but It wouldn't be optimized and tried to made the data more flat.
   - Aimed to optimize for frequent operations like rendering chat messages and sending chat history
   - Balanced the need for efficient version switching and editing capabilities
5. Optimized state structure for performance and memory efficiency.
6. Implemented Context API to avoid props drilling.
7. Coded, refactored, and tested iteratively:
   - Implemented initial features based on the designed structure
   - Continuously refactored code to improve readability and maintainability
   - Conducted thorough testing after each iteration, including edge cases
   - Used React Developer Tools for debugging and performance optimization
   - Tested the application under various network conditions to ensure robustness

### Changes:

- **ConversationContext**:

  - Structured context state for efficiency
  - Implemented flat data structure to avoid bloat
  - ```javascript
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
    ```

- **conversations.reducer.ts**:
  - Utilized reducer for context management
  - Centralized business logic
- **usePromptSubmit.hook.tsx**:
  - Created hook for reusable react stateful logic
- **ChatMessage.tsx**:
  - Added UI elements for editing and version switching
  - Implemented performance optimizations
- **ChatMessages.tsx**:
  - Improved animation logic
- **Homepage.tsx**:
  - Moved states to context

**Time taken**: [Insert time here]

## Bonus Task: Error Handling (Partially Completed)

### Changes:

- **ErrorBoundary.tsx**:
  - Implemented global error boundary component
- **HomePage useSearch**:
  - Added error throwing for search API errors
- **useSearch**:
  - Enhanced queryFn with try-catch
  - Implemented error message extraction method

**Time taken**: [Insert time here]

## Future Improvements:

1. Further context API integration for better state management
2. Enhance error handling and input field validations
3. Implement search filter icons
4. Simplify version-switching and editing logic
5. Add text skeleton for assistant responses while edited a message and submit a new prompt
6. Provide user feedback for editing actions
