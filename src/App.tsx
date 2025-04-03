import PdfUploader from './components/PdfUploader';
import PdfPreview from './components/PdfPreview';
import PdfPageSelector from './components/PdfPageSelector';

import './App.css';

function App() {
  return (
    <div id="app">
      <div>
        <PdfUploader />
        <PdfPreview />
        <PdfPageSelector />
      </div>
    </div>
  );
}

export default App;
