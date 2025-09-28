import React from 'react';
import { Text } from 'react-native';
import { Svg } from 'react-native-svg';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
declare const badgeStyle: import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
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
    size: {
        sm: string;
        md: string;
        lg: string;
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
    size: {
        sm: string;
        md: string;
        lg: string;
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
    size: {
        sm: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        md: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        lg: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
    };
}), undefined, "flex-row items-center rounded-sm data-[disabled=true]:opacity-50 px-2 py-1", import("tailwind-variants/dist/config").TVConfig<{
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
    size: {
        sm: string;
        md: string;
        lg: string;
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
    size: {
        sm: string;
        md: string;
        lg: string;
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
    size: {
        sm: string;
        md: string;
        lg: string;
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
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, undefined, "flex-row items-center rounded-sm data-[disabled=true]:opacity-50 px-2 py-1", import("tailwind-variants/dist/config").TVConfig<{
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
    size: {
        sm: string;
        md: string;
        lg: string;
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
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}>, unknown, unknown, undefined>>;
declare const badgeIconStyle: import("@gluestack-ui/nativewind-utils/types").TVReturnType<({} | {} | {}) & {
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, undefined, "fill-none", import("tailwind-variants/dist/config").TVConfig<unknown, {} | {}>, {} | {}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<unknown, undefined, "fill-none", import("tailwind-variants/dist/config").TVConfig<unknown, {} | {}>, unknown, unknown, undefined>>;
type IPrimitiveIcon = React.ComponentPropsWithoutRef<typeof Svg> & {
    height?: number | string;
    width?: number | string;
    fill?: string;
    color?: string;
    size?: number | string;
    stroke?: string;
    as?: React.ElementType;
    className?: string;
    classNameColor?: string;
};
declare const PrimitiveIcon: React.ForwardRefExoticComponent<IPrimitiveIcon & React.RefAttributes<Svg>>;
declare const ContextView: React.ForwardRefExoticComponent<import("react-native").ViewProps & {
    context?: any;
} & React.RefAttributes<unknown>>;
type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> & VariantProps<typeof badgeStyle>;
declare const Badge: {
    ({ children, action, variant, size, className, ...props }: {
        className?: string | undefined;
    } & Omit<import("react-native").ViewProps & {
        context?: any;
    } & React.RefAttributes<unknown>, "ref"> & VariantProps<import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
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
        size: {
            sm: string;
            md: string;
            lg: string;
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
        size: {
            sm: string;
            md: string;
            lg: string;
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
        size: {
            sm: import("tailwind-merge").ClassNameValue | {
                base?: import("tailwind-merge").ClassNameValue;
            };
            md: import("tailwind-merge").ClassNameValue | {
                base?: import("tailwind-merge").ClassNameValue;
            };
            lg: import("tailwind-merge").ClassNameValue | {
                base?: import("tailwind-merge").ClassNameValue;
            };
        };
    }), undefined, "flex-row items-center rounded-sm data-[disabled=true]:opacity-50 px-2 py-1", import("tailwind-variants/dist/config").TVConfig<{
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
        size: {
            sm: string;
            md: string;
            lg: string;
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
        size: {
            sm: string;
            md: string;
            lg: string;
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
        size: {
            sm: string;
            md: string;
            lg: string;
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
        size: {
            sm: string;
            md: string;
            lg: string;
        };
    }, undefined, "flex-row items-center rounded-sm data-[disabled=true]:opacity-50 px-2 py-1", import("tailwind-variants/dist/config").TVConfig<{
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
        size: {
            sm: string;
            md: string;
            lg: string;
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
        size: {
            sm: string;
            md: string;
            lg: string;
        };
    }>, unknown, unknown, undefined>>>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const BadgeText: React.ForwardRefExoticComponent<import("react-native").TextProps & VariantProps<import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
    };
} & {
    action: {
        error: string;
        warning: string;
        success: string;
        info: string;
        muted: string;
    };
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, undefined, "text-typography-700 font-body font-normal tracking-normal uppercase", import("tailwind-variants/dist/config").TVConfig<{
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
    };
}, undefined, "text-typography-700 font-body font-normal tracking-normal uppercase", import("tailwind-variants/dist/config").TVConfig<{
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
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
    sub: {
        true: string;
    };
    italic: {
        true: string;
    };
    highlight: {
        true: string;
    };
}>, unknown, unknown, undefined>>> & React.RefAttributes<Text>>;
type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof PrimitiveIcon> & VariantProps<typeof badgeIconStyle>;
declare const BadgeIcon: React.ForwardRefExoticComponent<IBadgeIconProps & React.RefAttributes<Svg>>;
export { Badge, BadgeIcon, BadgeText };
