import type { SxProps } from '@mui/material';
import { styled } from '@mui/material';

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
  handleChange,
  placeholder,
  value,
  sx,
}: {
  handleChange: (text: string) => void;
  placeholder?: string;
  value?: string;
  sx?: SxProps;
}) => {
  return (
    <StyledTextarea
      style={{ height: 'initial' }}
      sx={sx}
      aria-label="empty textarea"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        handleChange(e.target.value);
      }}
    />
  );
};

export default Editor;
