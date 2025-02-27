import { ParagraphVariant } from '#/atoms/typography';
import { Size } from '#/atoms/styles/constants/size';
import { Hue } from '#/atoms/styles/palette';

import { ButtonHueState } from './types';

type ButtonTypographyVariantMap = {
    [key in Size | 'extraSmall']: ParagraphVariant;
};

type ButtonHueMap = {
    [key in ButtonHueState]: Hue;
};

export const TYPOGRAPHY_VARIANTS_BY_SIZE: ButtonTypographyVariantMap = {
    extraSmall: 'button12',
    small: 'button14',
    medium: 'button16',
    large: 'button18',
};

export const HUES_BY_STATE: ButtonHueMap = {
    default: 'purple',
    success: 'green',
    danger: 'red',
    warning: 'yellow',
    contrast: 'purple',
    darkVariant: 'purple',
};

export const BUTTON_VARIANTS = [
    'solid',
    'outlined',
    'secondary',
    'text',
] as const;
