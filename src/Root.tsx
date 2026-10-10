import {Composition} from 'remotion';
import {BracesAd} from './BracesAd';
import {BracesAdV2} from './v2/BracesAdV2';
import {FPS, TOTAL} from './theme';
import {TOTAL2} from './v2/kit';
import {RootCanalAd} from './v3/RootCanalAd';
import {TOTAL3} from './v3/timeline';
import {CheckupVideo} from './checkup/CheckupVideo';
import {TOTAL_CHECKUP} from './checkup/theme';
import {ReviewsVideo, REVIEW_FRAMES} from './reviews/ReviewsVideo';

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
      id="DentalCheckup"
      component={CheckupVideo}
      durationInFrames={TOTAL_CHECKUP}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="ReviewStory"
      component={ReviewsVideo}
      durationInFrames={REVIEW_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="ReviewSquare"
      component={ReviewsVideo}
      durationInFrames={REVIEW_FRAMES}
      fps={FPS}
      width={1080}
      height={1080}
    />
  </>
);
