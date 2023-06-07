import type { Room, Note } from '@eweser/db';
import type { SxProps } from '@mui/material';
import { styled } from '@mui/material';

import { useNotesDocuments } from '../CollectionContext';

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
  const { updateNote, notes } = useNotesDocuments(room);

  return (
    <StyledTextarea
      key={selectedNoteId}
      style={{ height: 'initial' }}
      sx={sx}
      aria-label="empty textarea"
      placeholder={placeholder}
      value={notes[selectedNoteId]?.text}
      disabled={!selectedNoteId}
      onChange={(e) => updateNote(selectedNoteId, e.target.value)}
    />
  );
};

export default Editor;
