import { globalStyle } from '@vanilla-extract/css';

globalStyle('#app', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
});

globalStyle('#app > div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  minWidth: '1512px',
  maxWidth: '1512px',
  height: '100%',
  minHeight: '752px',
  maxHeight: '752px'
});

globalStyle('#app > div > div', {
  overflow: 'hidden',
  height: '100%',
  background: '#e9e9e9',
  borderRadius: '8px'
});

globalStyle('#app > div > div:nth-child(1)', {
  flex: '0 0 280px'
});

globalStyle('#app > div > div:nth-child(2)', {
  flex: '0 0 962px'
});

globalStyle('#app > div > div:nth-child(3)', {
  flex: '0 0 250px'
});
