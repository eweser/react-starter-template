import type { Room, Note } from '@eweser/db';
import type { SxProps } from '@mui/material';
import { styled } from '@mui/material';
import { useDatabase } from '../DatabaseContext';
import { useState } from 'react';

const StyledTextarea = styled('textarea')(
  ({ theme: { palette } }) => `
  flex: 1;
  font-family: Roboto, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  min-height: 50%;
  padding: 24px;
  border: none;
  overflow: auto;
  resize: none;
  color: ${palette.text.primary};
  background: ${palette.background.paper};
  
  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const Editor = ({
  placeholder,
  sx,
  room,
  selectedNoteId,
}: {
  placeholder?: string;
  sx?: SxProps;
  room: Room<Note>;
  selectedNoteId: string;
}) => {
  const { db } = useDatabase();
  const Notes = db.getDocuments(room);
  const [noteText, setNoteText] = useState(Notes.get(selectedNoteId)?.text);
  const updateNoteText = (text: string) => {
    const note = Notes.get(selectedNoteId);
    if (!note || !text) return;
    note.text = text;
    setNoteText(text);
    Notes.set(note);
  };
  return (
    <StyledTextarea
      style={{ height: 'initial' }}
      sx={sx}
      aria-label="empty textarea"
      placeholder={placeholder}
      value={noteText}
      onChange={(e) => updateNoteText(e.target.value)}
    />
  );
};

export default Editor;
