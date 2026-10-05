import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {BracesAdV2} from './v2/BracesAdV2';
import {FPS, TOTAL} from './theme';
import {TOTAL2} from './v2/kit';
import {RootCanalAd} from './v3/RootCanalAd';
import {TOTAL3} from './v3/timeline';
import {GumAd} from './v4/GumAd';
import {TOTAL4} from './v4/timeline';

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
      id="IzznaraRootCanal"
      component={RootCanalAd}
      durationInFrames={TOTAL3}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="IzznaraGumRecession"
      component={GumAd}
      durationInFrames={TOTAL4}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
