import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {BracesAdV2} from './v2/BracesAdV2';
import {FPS, TOTAL} from './theme';
import {TOTAL2} from './v2/kit';
import {HilangGigiV3} from './v3/HilangGigiV3';
import {TOTAL3} from './v3/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="IzznaraBraces"
      component={BracesAd}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="IzznaraBracesV2"
      component={BracesAdV2}
      durationInFrames={TOTAL2}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="IzznaraHilangGigiV3"
      component={HilangGigiV3}
      durationInFrames={TOTAL3}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
