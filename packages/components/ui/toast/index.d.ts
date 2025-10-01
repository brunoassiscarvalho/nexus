import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
export declare const useToast: () => {
    show: (props: import("@gluestack-ui/toast/lib/typescript/types").InterfaceToastProps) => any;
    close: (id: any) => void;
    closeAll: () => void;
    isActive: (id: any) => boolean;
};
export declare const UIToast: import("@gluestack-ui/toast/lib/typescript/types").IToastComponentType<import("react-native").ViewProps & {
    context?: any;
} & React.RefAttributes<unknown>, import("react-native").TextProps, import("react-native").TextProps>;
declare const toastStyle: import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
} | ({
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
} & {
    action: {
        error: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        warning: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        success: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        info: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        muted: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
    };
    variant: {
        solid: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        outline: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
    };
}), undefined, "p-4 m-1 rounded-md gap-1 web:pointer-events-auto shadow-hard-5 border-outline-100", import("tailwind-variants/dist/config").TVConfig<{
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
}, {
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
}>, {
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
}, undefined, "p-4 m-1 rounded-md gap-1 web:pointer-events-auto shadow-hard-5 border-outline-100", import("tailwind-variants/dist/config").TVConfig<{
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
}, {
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    variant: {
        solid: string;
        outline: string;
    };
}>, unknown, unknown, undefined>>;
type IToastProps = React.ComponentProps<typeof UIToast> & {
    className?: string;
} & VariantProps<typeof toastStyle>;
export declare const Toast: React.ForwardRefExoticComponent<Omit<IToastProps, "ref"> & React.RefAttributes<unknown>>;
export declare const ToastTitle: React.ForwardRefExoticComponent<import("react-native").TextProps & {
    className?: string | undefined;
} & VariantProps<import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
} & {
    variant: {
        solid: string;
        outline: string;
    };
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
}, undefined, "text-typography-0 font-medium font-body tracking-md text-left", import("tailwind-variants/dist/config").TVConfig<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, {
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}>, {
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, undefined, "text-typography-0 font-medium font-body tracking-md text-left", import("tailwind-variants/dist/config").TVConfig<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, {
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}>, unknown, unknown, undefined>>> & React.RefAttributes<never>>;
export declare const ToastDescription: React.ForwardRefExoticComponent<import("react-native").TextProps & {
    className?: string | undefined;
} & VariantProps<import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
} & {
    variant: {
        solid: string;
        outline: string;
    };
}, undefined, "font-normal font-body tracking-md text-left", import("tailwind-variants/dist/config").TVConfig<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, {
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}>, {
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, undefined, "font-normal font-body tracking-md text-left", import("tailwind-variants/dist/config").TVConfig<{
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}, {
    isTruncated: {
        true: string;
    };
    bold: {
        true: string;
    };
    underline: {
        true: string;
    };
    strikeThrough: {
        true: string;
    };
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
}>, unknown, unknown, undefined>>> & React.RefAttributes<never>>;
export {};
