import './app.css.ts';
import { PdfUploader } from './components/PdfUploader';
import PdfPreview from './components/PdfPreview/PdfPreview';
import PdfPages from './components/PdfPages/PdfPages';
import { CanvasProvider } from './context/CanvasProvider';

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
