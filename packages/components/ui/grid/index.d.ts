import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { View, ViewProps } from 'react-native';
declare const Grid: React.ForwardRefExoticComponent<ViewProps & VariantProps<import("@gluestack-ui/nativewind-utils/types").TVReturnType<{} | {} | {}, undefined, "w-full grid grid-cols-12" | "w-full box-border flex-row flex-wrap justify-start", import("tailwind-variants/dist/config").TVConfig<unknown, {} | {}>, {} | {}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<unknown, undefined, "w-full grid grid-cols-12" | "w-full box-border flex-row flex-wrap justify-start", import("tailwind-variants/dist/config").TVConfig<unknown, {} | {}>, unknown, unknown, undefined>>> & {
    gap?: number | undefined;
    rowGap?: number | undefined;
    columnGap?: number | undefined;
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse" | undefined;
    padding?: number | undefined;
    paddingLeft?: number | undefined;
    paddingRight?: number | undefined;
    paddingStart?: number | undefined;
    paddingEnd?: number | undefined;
    _extra: {
        className: string;
    };
} & React.RefAttributes<View>>;
declare const GridItem: React.ForwardRefExoticComponent<ViewProps & VariantProps<import("@gluestack-ui/nativewind-utils/types").TVReturnType<{} | {} | {}, undefined, "w-full " | "w-full w-auto col-span-1", import("tailwind-variants/dist/config").TVConfig<unknown, {} | {}>, {} | {}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<unknown, undefined, "w-full " | "w-full w-auto col-span-1", import("tailwind-variants/dist/config").TVConfig<unknown, {} | {}>, unknown, unknown, undefined>>> & {
    index?: number | undefined;
    _extra: {
        className: string;
    };
} & React.RefAttributes<View>>;
export { Grid, GridItem };
