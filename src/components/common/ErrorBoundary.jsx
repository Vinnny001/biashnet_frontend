import { Component } from "react";
import { Alert, AlertTitle, Box, Button, Stack, Typography } from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";

/*
|--------------------------------------------------------------------------
| Error Boundary
|--------------------------------------------------------------------------
|
| Without one of these, a single bad field renders the entire app as a
| blank white screen — React unmounts the whole tree when a render throws
| and nothing catches it. That has bitten this app more than once, always
| the same way: data from mpesa-api arrives in a shape the page didn't
| expect (a Firestore timestamp object where a date string was assumed, an
| address object where a string was assumed) and the page vanishes with no
| clue as to why.
|
| Wrapping each routed page means a broken page shows an error and leaves
| the rest of the app — nav, layout, other routes — usable.
|
| Note this only catches errors thrown during render/lifecycle. Failures
| inside event handlers and promises still need their own try/catch, which
| is why pages keep their own error state as well.
|
|--------------------------------------------------------------------------
*/

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Page crashed:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: 800 }}>This page didn&apos;t load</AlertTitle>

          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Something in the data on this page was unexpected, so it stopped
            rendering. Nothing you did caused it and nothing has been lost.
          </Typography>

          <Typography
            variant="caption"
            component="pre"
            sx={{
              display: "block",
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              bgcolor: "action.hover",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {String(error?.message || error)}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<RefreshRounded />}
              onClick={this.handleReset}
            >
              Try again
            </Button>

            <Button
              size="small"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </Stack>
        </Alert>
      </Box>
    );
  }
}
