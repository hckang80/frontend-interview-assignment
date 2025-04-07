import { CSSProperties } from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

const override: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
};

interface LoadingProps {
  loading: boolean;
  size?: number;
}

const Loading: React.FC<LoadingProps> = ({ loading, size = 10 }) => {
  return (
    <SyncLoader
      loading={loading}
      cssOverride={override}
      color="var(--primary)"
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loading;
