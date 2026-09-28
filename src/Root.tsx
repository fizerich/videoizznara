import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {BracesAdV2} from './v2/BracesAdV2';
import {FPS, TOTAL} from './theme';
import {TOTAL2} from './v2/kit';
import {TipsV3} from './v3/TipsV3';
import {TOTAL3} from './v3/data';
import {VoxV4} from './v4/VoxV4';
import {MimpiV5, TOTAL5} from './v5/MimpiV5';

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
      id="IzznaraTipsV3"
      component={TipsV3}
      durationInFrames={TOTAL3}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="IzznaraTipsV4"
      component={VoxV4}
      durationInFrames={TOTAL3}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="MimpiV5"
      component={MimpiV5}
      durationInFrames={TOTAL5}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
