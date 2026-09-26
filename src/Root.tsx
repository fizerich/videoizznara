import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {BracesAdV2} from './v2/BracesAdV2';
import {FPS, TOTAL} from './theme';
import {TOTAL2} from './v2/kit';
import {CUTS, cutLength, SupcaseAd} from './supcase/SupcaseAd';

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
      id="SupcaseShopee"
      component={SupcaseAd}
      defaultProps={{cut: 'full' as const}}
      durationInFrames={cutLength(CUTS.full)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SupcaseShopee15"
      component={SupcaseAd}
      defaultProps={{cut: 'short' as const}}
      durationInFrames={cutLength(CUTS.short)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SupcaseShopeeVO"
      component={SupcaseAd}
      defaultProps={{cut: 'full' as const, vo: true}}
      durationInFrames={cutLength(CUTS.full)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="SupcaseShopee15VO"
      component={SupcaseAd}
      defaultProps={{cut: 'short' as const, vo: true}}
      durationInFrames={cutLength(CUTS.short)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
