import { Dimensions, PixelRatio } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const guidLineBaseWidth = 375;

export function scaleSize(size: number) {
  return (WINDOW_WIDTH / guidLineBaseWidth) * size;
}

export function scaleFont(size: number) {
  return size * PixelRatio.getFontScale();
}

function dimensions(
  top: number,
  right: number = top,
  bottom: number = top,
  left: number = right,
  property: string,
) {
  const styles: { [key: string]: any } = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(
  top: number,
  right: number | undefined,
  bottom: number | undefined,
  left: number | undefined,
) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(
  top: number,
  right: number | undefined,
  bottom: number | undefined,
  left: number | undefined,
) {
  return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(
  color: string,
  offset: { height: number; width: number } = { height: 2, width: 2 },
  radius: number = 8,
  opacity: number = 0.2,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowRadius: radius,
    shadowOpacity: opacity,
  };
}
