import { parseToRgba } from 'color2k';

export const HUES = ['neutral', 'purple', 'green', 'yellow', 'red'] as const;
export const VALUES = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const DEFAULT_HUE = 'neutral';
const DEFAULT_VALUE = 600;

export type Hue = (typeof HUES)[number];
export type Value = (typeof VALUES)[number];

/** A color in a CSS-readable format (e.g. `"#9333EA"`) */
export type Color = string;

type Palette = { [hue in Hue]: { [value in Value]: Color } };
const PALETTE: Palette = {
    purple: {
        100: '#F4EBFF',
        200: '#E4D4FF',
        300: '#D1B8FF',
        400: '#BE9EFF',
        500: '#AC85FF',
        600: '#955AFF',
        700: '#7D3AFF',
        800: '#6128D6',
        900: '#491FA3',
    },
    green: {
        100: '#E6FFEF',
        200: '#C7FFE0',
        300: '#9BFFC8',
        400: '#67FFAD',
        500: '#32F495',
        600: '#1ED17E',
        700: '#1AAA69',
        800: '#158453',
        900: '#0E5E3D',
    },
    yellow: {
        100: '#FFF9D6',
        200: '#FFF1AE',
        300: '#FFE77E',
        400: '#FFD74D',
        500: '#FFC71E',
        600: '#F3B000',
        700: '#D19200',
        800: '#A37400',
        900: '#705300',
    },
    red: {
        100: '#FFEAEA',
        200: '#FFC9C9',
        300: '#FFA3A3',
        400: '#FF7C7C',
        500: '#FF5555',
        600: '#FF3838',
        700: '#E81B1B',
        800: '#B71515',
        900: '#8A1010',
    },
    neutral: {
        100: '#FAFBFC',
        200: '#F1F2F5',
        300: '#E3E5E8',
        400: '#CCD0D6',
        500: '#B4B9C0',
        600: '#969CA6',
        700: '#767E89',
        800: '#585E66',
        900: '#3B3F45',
    },
};

/**
 * Get a CSS-readable color string for a given `hue` and `value`
 *
 * If the palette doesn't give a definition for the (hue, value) pair, a default color is returned,
 * so this function is guaranteed to return a color.
 */
export const getColor = (hue: Hue, value: Value) => {
    const color = PALETTE[hue][value];
    if (color === undefined)
        console.warn(`value ${value} for hue ${hue} is not defined`);
    return color || (PALETTE[DEFAULT_HUE][DEFAULT_VALUE] as Color);
};

export const getWhite = () => {
    return '#FFFFFF';
};

/**
 * Convert a color and alpha value to a CSS-readable color string
 *
 * styled-components doesn't support using css rgba function with hex strings
 * so it's hard to set an alpha value to our palette. Therefore we use tinycolor
 * to expose these helpers.
 */

const getAlphaRgbString = (color: string, alpha: number) => {
    const [r, g, b] = parseToRgba(color);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getRgba = (hue: Hue, value: Value, alpha: number) => {
    const color = getColor(hue, value);
    return getAlphaRgbString(color, alpha);
};
