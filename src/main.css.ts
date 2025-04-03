import { globalStyle } from '@vanilla-extract/css';

globalStyle(':root', {
  vars: {
    '--primary': '#5e5e5e'
  },
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  lineHeight: 1.5,
  fontWeight: 400,
  colorScheme: 'light dark',
  color: 'rgba(0, 0, 0, 0.64)',
  backgroundColor: '#242424',
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
});

globalStyle('html, body', {
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  height: '100%'
});

globalStyle('*', {
  margin: 0,
  padding: 0
});

globalStyle('*, :after, :before', {
  boxSizing: 'border-box',
  flexShrink: 0
});

globalStyle('#root', {
  overflow: 'auto',
  width: '100%',
  height: '100%'
});

globalStyle('button', {
  background: 'none',
  border: 0
});

globalStyle('button:not(:disabled)', {
  cursor: 'pointer'
});

globalStyle('button:disabled', {
  cursor: 'not-allowed'
});
