import React from 'react';
import {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    P,
    Body10,
    Body12,
    Body14,
    Body16,
    Body18,
    Button14,
    Button16,
    LabelText,
    Caption,
    HelpText,
    DataText,
    MenuText,
    Em,
    Small,
    Blockquote,
    BaselineFix,
} from './index';

const TypographyExamples: React.FC = () => {
    return (
        <div>
            <H1>Heading 1</H1>
            <H2>Heading 2</H2>
            <H3>Heading 3</H3>
            <H4>Heading 4</H4>
            <H5>Heading 5</H5>
            <H6>Heading 6</H6>

            <P variant='body16'>
                This is a paragraph with default body16 styling.
            </P>
            <Body10>This is Body10 text.</Body10>
            <Body12>This is Body12 text.</Body12>
            <Body14>This is Body14 text.</Body14>
            <Body16>This is Body16 text.</Body16>
            <Body18>This is Body18 text.</Body18>

            <Button14>This is Button14 text.</Button14>
            <Button16>This is Button16 text.</Button16>

            <LabelText>This is LabelText.</LabelText>
            <Caption>This is Caption text.</Caption>
            <HelpText>This is HelpText.</HelpText>
            <DataText>This is DataText.</DataText>
            <MenuText>This is MenuText.</MenuText>

            <P>
                This is an <Em>emphasized</Em> word.
            </P>

            <P>
                This is a <Small>small</Small> text.
            </P>

            <Blockquote>
                This is a blockquote. It has a left border for emphasis.
            </Blockquote>

            <P>
                This text has a <BaselineFix>baseline fix</BaselineFix> applied.
            </P>
        </div>
    );
};

export default TypographyExamples;
