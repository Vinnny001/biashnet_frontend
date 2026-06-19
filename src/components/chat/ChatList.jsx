import { List, ListItemButton, ListItemText, Typography } from "@mui/material";

export default function ChatList({ threads = [], onSelect }) {
  if (!threads.length) return <Typography color="text.secondary">No conversations yet.</Typography>;

  return (
    <List>
      {threads.map((thread) => (
        <ListItemButton key={thread.id || thread._id} onClick={() => onSelect?.(thread)}>
          <ListItemText
            primary={thread.title || thread.participantName || "Conversation"}
            secondary={thread.lastMessage || "Open chat"}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
