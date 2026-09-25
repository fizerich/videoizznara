import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {FPS, TOTAL} from './theme';
import {NafasAd} from './nafas/NafasAd';
import {TOTAL as NAFAS_TOTAL} from './nafas/theme';

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
      id="IzznaraNafas"
      component={NafasAd}
      durationInFrames={NAFAS_TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
