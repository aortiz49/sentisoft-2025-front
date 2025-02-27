import * as React from 'react';

import { Body16 } from '#/atoms/typography';
import { ChevronRight } from 'lucide-react';
import { ChevronWrapper, Container, ContentWrapper } from './styles';
import { getColor } from '#/atoms/styles/palette';

export type Breadcrumb = {
    /**
     * Content of the breadcrumb element
     */
    content: string | JSX.Element;
    /**
     * Action when clicking on content
     */
    action?: () => void;
};

type Props = {
    breadcrumbs: Breadcrumb[];
};

const CHEVRON_SIZE = 16;

export const Breadcrumbs: React.FC<Props> = ({ breadcrumbs }) => {
    return (
        <Container>
            {breadcrumbs.map(({ content, action }, index) => {
                return (
                    <React.Fragment key={index}>
                        <ContentWrapper onClick={action} link={!!action}>
                            <Body16
                                inheritColor={!!action}
                                hueValue={700}
                                weight={500}
                            >
                                {content}
                            </Body16>
                        </ContentWrapper>
                        {index !== breadcrumbs.length - 1 && (
                            <ChevronWrapper>
                                <ChevronRight
                                    color={getColor('neutral', 600)}
                                    size={CHEVRON_SIZE}
                                />
                            </ChevronWrapper>
                        )}
                    </React.Fragment>
                );
            })}
        </Container>
    );
};
