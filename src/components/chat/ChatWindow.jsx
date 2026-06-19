import { Stack } from "@mui/material";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages = [], currentUserId, onSend }) {
  return (
    <Stack spacing={2}>
      <Stack spacing={1} sx={{ minHeight: 320 }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id || message._id}
            message={message}
            mine={message.senderId === currentUserId}
          />
        ))}
      </Stack>
      <ChatInput onSend={onSend} />
    </Stack>
  );
}
