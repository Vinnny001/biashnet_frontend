import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const questions = [
  ["How does Biashnet work?", "Browse listings, contact sellers, add items to cart, and place orders securely through the backend API."],
  ["Does the frontend use Firebase?", "No. The frontend communicates with the Node and Express backend only."],
  ["Can I sell on Biashnet?", "Yes. Create a seller account and manage listings from the seller dashboard."]
];

export default function FAQ() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">FAQ</Typography>
      {questions.map(([question, answer]) => (
        <Accordion key={question}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
