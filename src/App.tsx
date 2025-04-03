import { PdfUploader } from './components/PdfUploader';
import PdfPreview from './components/PdfPreview.tsx';
import PdfPages from './components/PdfPages.tsx';

import './app.css.ts';

function App() {
  return (
    <div id="app">
      <div>
        <PdfUploader />
        <PdfPreview />
        <PdfPages />
      </div>
    </div>
  );
}

export default App;
