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
        100: '#F3E8FF',
        200: '#E0C3FC',
        300: '#D8B4F8',
        400: '#C084FC',
        500: '#A855F7',
        600: '#9333EA',
        700: '#7E22CE',
        800: '#6B21A8',
        900: '#4C1D95',
    },
    green: {
        100: '#EEFFE5',
        200: '#DDFFCC',
        300: '#B8F7A1',
        400: '#69E052',
        500: '#32B526',
        600: '#1D8725',
        700: '#16691D',
        800: '#0E4E13',
        900: '#09340D',
    },
    yellow: {
        100: '#FFF8EB',
        200: '#FFF1D6',
        300: '#FFE4AD',
        400: '#FFC247',
        500: '#F5A300',
        600: '#CC7A00',
        700: '#AD6800',
        800: '#704000',
        900: '#472600',
    },
    red: {
        100: '#FFF0F2',
        200: '#FFE0E4',
        300: '#FFC2CA',
        400: '#FF5C72',
        500: '#FD0D2D',
        600: '#D20420',
        700: '#A30016',
        800: '#7A0010',
        900: '#52000B',
    },
    neutral: {
        100: '#FCFCFD',
        200: '#F6F7F8',
        300: '#F1F2F4',
        400: '#E4E7EC',
        500: '#D1D5DB',
        600: '#B0B6BF',
        700: '#6E7681',
        800: '#2F3237',
        900: '#212327',
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
