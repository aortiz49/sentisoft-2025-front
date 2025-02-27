// Define duration types
export type DurationInMs = number;
export type StringDurationInMs = string;

export type DurationPreset = 'short' | 'medium' | 'long';
export type DurationContext = 'transition' | 'debounce' | 'modals';

type DurationContextsObject = { [key in DurationPreset]: DurationInMs };
type DurationContextsStringObject = {
    [key in DurationPreset]: StringDurationInMs;
};

type DurationObject = { [key in DurationContext]: DurationContextsObject };
type StyleDurationObject = {
    [key in DurationContext]: DurationContextsStringObject;
};

/** Base durations in milliseconds */
export const DURATION: DurationObject = {
    transition: { short: 120, medium: 500, long: 1_000 },
    debounce: { short: 500, medium: 1_000, long: 2_000 },
    modals: { short: 50, medium: 100, long: 150 },
};

/**
 * Converts DURATION values to string format with "ms" appended.
 */
export const STYLE_DURATION: StyleDurationObject = Object.fromEntries(
    Object.entries(DURATION).map(([context, durations]) => [
        context,
        Object.fromEntries(
            Object.entries(durations).map(([preset, value]) => [
                preset,
                `${value}ms`,
            ])
        ),
    ])
) as StyleDurationObject;
