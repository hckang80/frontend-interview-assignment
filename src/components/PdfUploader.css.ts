import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '12px'
});

export const top = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
});

export const stampUpload = style({
  minHeight: '48px'
});

export const stamps = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  minHeight: '54px'
});

export const stampButton = style({
  overflow: 'hidden',
  width: '48px',
  height: '48px',
  borderRadius: '4px'
});

export const stampButtonActive = style([
  stampButton,
  {
    outline: '2px solid #5e5e5e'
  }
]);

export const stampImage = style({
  width: '100%',
  height: '100%'
});

export const pdfUpload = style({
  minHeight: '48px'
});

export const pdfFile = style({
  minHeight: '48px'
});

export const bottom = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
});

export const button = style({
  padding: '8px 12px',
  borderRadius: '12px',
  backgroundColor: '#5e5e5e'
});

export const pdfFileRemove = style({
  padding: '4px 8px',
  backgroundColor: 'transparent',
  color: '#5e5e5e',
  fontSize: '16px'
});
