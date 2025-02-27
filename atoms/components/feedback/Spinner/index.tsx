import * as React from 'react';

import { Container, Dot, StyleProps } from './styles';

export const Spinner: React.FunctionComponent<Partial<StyleProps>> = ({
    hue = 'neutral',
    size = 'medium',
    inverted = false,
    hueValue = 400,
}) => {
    return (
        <Container>
            <Dot
                size={size}
                inverted={inverted}
                hue={hue}
                delayMultiplier={1}
                hueValue={hueValue}
            />
            <Dot
                size={size}
                inverted={inverted}
                hue={hue}
                delayMultiplier={2}
                hueValue={hueValue}
            />
            <Dot
                size={size}
                inverted={inverted}
                hue={hue}
                delayMultiplier={3}
                hueValue={hueValue}
            />
        </Container>
    );
};
