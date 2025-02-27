import { getColor } from '../palette';

export type BorderRadiusKeys = 'small' | 'medium' | 'large';

export type BorderRadiusObject = {
    [key in BorderRadiusKeys]: string;
};

export const BORDER_RADIUS: BorderRadiusObject = {
    small: '8px',
    medium: '12px',
    large: '14px',
};

export const BORDER_SIZE: string = `1px solid ${getColor('neutral', 400)}`;
