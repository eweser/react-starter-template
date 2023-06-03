import { TextareaAutosize, styled } from '@mui/material';

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme: { palette } }) => `
  flex: 1;
  font-family: Roboto, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 24px;
  border: none;

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
}: {
  handleChange: (text: string) => void;
  placeholder?: string;
  value?: string;
}) => {
  return (
    <StyledTextarea
      style={{ height: 'initial' }}
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
