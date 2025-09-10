// src/theme/linkBehavior.tsx
import * as React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';

export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<NextLinkProps, 'href'> & { href: NextLinkProps['href'] }
>(function LinkBehavior(props, ref) {
  const { href, ...other } = props;
  return <NextLink ref={ref} href={href} {...other} />;
});

// Useful helper if you want a wrapped MUI Link that renders NextLink
export function NextMuiLink(
  props: MuiLinkProps & { href: NextLinkProps['href'] },
) {
  return <MuiLink component={LinkBehavior} {...props} />;
}
