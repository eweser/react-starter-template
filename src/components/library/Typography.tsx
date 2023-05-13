import { Typography, TypographyProps } from '@mui/material';

export type CustomTypographyProps = Omit<TypographyProps, 'variant'>;

export const H1 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="h1" />
);
export const H2 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="h2" />
);
export const H3 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="h3" />
);
export const H4 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="h4" />
);
export const H5 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="h5" />
);
export const H6 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="h6" />
);

export const Body1 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="body1" />
);
export const Body2 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="body2" />
);
export const ButtonFont = (props: CustomTypographyProps) => (
  <Typography {...props} variant="button" />
);
export const Subtitle1 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="subtitle1" />
);
export const Subtitle2 = (props: CustomTypographyProps) => (
  <Typography {...props} variant="subtitle2" />
);
export const Caption = (props: CustomTypographyProps) => (
  <Typography {...props} variant="caption" />
);

export const Overline = (props: CustomTypographyProps) => (
  <Typography {...props} variant="overline" />
);
