import styled, { css } from 'styled-components';

import { getWhite } from '#/atoms/styles/palette';

export const Container = styled.nav`
    display: flex;
    flex-direction: row;
    gap: 2px;
    align-items: center;
`;

export const ChevronWrapper = styled.span`
    margin-top: 4px;
    display: flex;
    align-items: center;
`;

export const ContentWrapper = styled.span<{ link?: boolean }>`
    ${(link) =>
        link &&
        css`
            cursor: pointer;
            color: ${getWhite()};

            &:hover {
                color: ${getWhite()};
            }

            &:last-child {
                cursor: default;
            }
        `};
`;
