import { Id } from "../../../../../../convex/_generated/dataModel"

interface ConversationProps {
    id: Id<"conversations">
}

const Conversation = ({id}:ConversationProps) => {
  return (
    <div>
        {id}
    </div>
  )
}

export default Conversation