import { scaleFont } from './mixins';

export const FONT_FAMILY_REGULAR = 'OpenSans-Regular';
export const FONT_FAMILY_BOLD = 'OpenSans-Bold';

export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_SEMI_BOLD = '700';
export const FONT_WEIGHT_BOLD = 'bold';

export const FONT_SIZE_10 = scaleFont(10);
export const FONT_SIZE_12 = scaleFont(12);
export const FONT_SIZE_14 = scaleFont(14);
export const FONT_SIZE_16 = scaleFont(16);
export const FONT_SIZE_18 = scaleFont(18);
export const FONT_SIZE_20 = scaleFont(20);
export const FONT_SIZE_21 = scaleFont(21);
export const FONT_SIZE_24 = scaleFont(24);
export const FONT_SIZE_28 = scaleFont(28);
export const FONT_SIZE_32 = scaleFont(32);

export const LINE_HEIGHT_24 = scaleFont(24);
export const LINE_HEIGHT_20 = scaleFont(20);
export const LINE_HEIGHT_16 = scaleFont(16);

export const FONT_REGULAR = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
};

export const FONT_BOLD = {
  fontFamily: FONT_FAMILY_BOLD,
  fontWeight: FONT_WEIGHT_BOLD,
};
