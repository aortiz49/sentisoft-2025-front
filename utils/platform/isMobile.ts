import { PHONE_WIDTH } from '#/atoms/styles/constants/layout';
import { screenWidth } from '#/utils/dom';

export const isMobile = () => {
    const currentScreenWidth = screenWidth();
    if (!currentScreenWidth) return false;
    return currentScreenWidth <= PHONE_WIDTH;
};
