import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  }

  return (
    <form onSubmit={submit}>
      <TextField
        fullWidth
        placeholder="Type a message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="Send message">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </form>
  );
}
