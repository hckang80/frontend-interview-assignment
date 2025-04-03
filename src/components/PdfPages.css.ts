import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

export const top = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowX: 'hidden',
  overflowY: 'auto',
  gap: '12px',
  flex: 1,
  width: '100%',
  height: '100%',
  padding: '12px'
});

export const image = style({
  cursor: 'pointer',
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  overflow: 'hidden',
  width: '160px',
  borderRadius: '12px',
  backgroundColor: 'aliceblue'
});

export const imageContent = style({
  width: '100%',
  height: 'auto'
});

export const imageIndex = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '4px 0',
  fontSize: '12px'
});
