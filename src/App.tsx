import { PdfUploader } from './components/PdfUploader';
import PdfPreview from './components/PdfPreview/PdfPreview.tsx';
import PdfPages from './components/PdfPages/PdfPages.tsx';

import './app.css.ts';
import { CanvasProvider } from './context/CanvasProvider.tsx';

function App() {
  return (
    <div id="app">
      <div>
        <CanvasProvider>
          <PdfUploader />
          <PdfPreview />
          <PdfPages />
        </CanvasProvider>
      </div>
    </div>
  );
}

export default App;
