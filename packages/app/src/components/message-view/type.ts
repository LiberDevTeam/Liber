export interface MessageViewProps {
  id: string;
  onReactionClick: (props: { messageId: string; emojiId: string }) => void;
}
