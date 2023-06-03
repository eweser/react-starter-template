import { Card, IconButton } from '@mui/material';
import type { Note } from '@eweser/db';
import { useState } from 'react';
import { DeleteRounded } from '@mui/icons-material';
export const NotePreview = ({
  note,
  deleteNote,
  onClick,
}: {
  note: Note;
  deleteNote: (note: Note) => void;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Card
      onClick={onClick}
      sx={{ p: 2, cursor: 'pointer', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {note.text}
      {hovered && (
        <IconButton
          sx={{ position: 'absolute', top: 5, right: 5 }}
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note);
          }}
        >
          <DeleteRounded fontSize="small" />
        </IconButton>
      )}
    </Card>
  );
};
