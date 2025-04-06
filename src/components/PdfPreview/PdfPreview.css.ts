import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
});

export const canvas = style({
  width: '500px'
});

export const button = style({
  position: 'absolute',
  right: '12px',
  top: '12px',
  padding: '8px 12px',
  borderRadius: '12px',
  backgroundColor: 'var(--primary)'
});
