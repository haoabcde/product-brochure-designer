import { cover, splitLeft, splitRight, fullBleed, listVertical, timeline } from './compositions.mjs';

const MODE_BY_TYPE = {
  cover: 'cover',
  intro: 'splitLeft',
  values: 'splitRight',
  venue: 'splitLeft',
  modules: 'splitRight',
  story: 'fullBleed',
  schedule: 'timeline',
  outcomes: 'listVertical',
  specs: 'listVertical',
  contact: 'fullBleed'
};

const COMPOSITIONS = { cover, splitLeft, splitRight, fullBleed, listVertical, timeline };

function avoidRepeat(previousMode, currentMode) {
  if (previousMode === currentMode && currentMode === 'splitLeft') return 'splitRight';
  if (previousMode === currentMode && currentMode === 'splitRight') return 'splitLeft';
  return currentMode;
}

export function renderPage(slide, ctx) {
  const { page, images } = ctx;
  let mode = MODE_BY_TYPE[page.type] || 'splitLeft';
  if (!images?.length && ['splitLeft', 'splitRight', 'fullBleed'].includes(mode)) {
    mode = 'listVertical';
  }
  if (ctx.previousMode) mode = avoidRepeat(ctx.previousMode, mode);
  ctx.previousMode = mode;
  return COMPOSITIONS[mode](slide, ctx);
}
