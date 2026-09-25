import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {FPS, TOTAL} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IzznaraBraces"
    component={BracesAd}
    durationInFrames={TOTAL}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
