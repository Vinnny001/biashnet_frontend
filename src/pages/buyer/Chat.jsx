import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ChatList from "../../components/chat/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";
import Card from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth";
import { chatService } from "../../services/chat.service";
import { normalizeList } from "../../utils/helpers";

export default function Chat() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    chatService.threads().then((payload) => setThreads(normalizeList(payload))).catch(() => setThreads([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    chatService.messages(selected.id || selected._id).then((payload) => setMessages(normalizeList(payload))).catch(() => setMessages([]));
  }, [selected]);

  async function handleSend(text) {
    if (!selected) return;
    const threadId = selected.id || selected._id;
    const optimistic = { id: Date.now(), senderId: user?.id || user?.uid, text };
    setMessages((current) => [...current, optimistic]);
    await chatService.send(threadId, { text });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Typography variant="h4" sx={{ mb: 2 }}>Chat</Typography>
        <Card><ChatList threads={threads} onSelect={setSelected} /></Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          {selected ? (
            <ChatWindow messages={messages} currentUserId={user?.id || user?.uid} onSend={handleSend} />
          ) : (
            <Typography color="text.secondary">Choose a conversation.</Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}
