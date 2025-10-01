import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
declare const UISwitch: import("@gluestack-ui/switch/lib/typescript/types").ISwitchComponentType<Omit<import("react-native").SwitchProps & React.RefAttributes<RNSwitch> & {
    context?: any;
}, "ref"> & React.RefAttributes<unknown>>;
declare const switchStyle: import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    size: {
        sm: string;
        md: string;
        lg: string;
    };
} | ({
    size: {
        sm: string;
        md: string;
        lg: string;
    };
} & {
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
}), undefined, "data-[focus=true]:outline-0 data-[focus=true]:ring-2 data-[focus=true]:ring-indicator-primary web:cursor-pointer disabled:cursor-not-allowed data-[disabled=true]:opacity-40 data-[invalid=true]:border-error-700 data-[invalid=true]:rounded-xl data-[invalid=true]:border-2", import("tailwind-variants/dist/config").TVConfig<{
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, {
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}>, {
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, undefined, "data-[focus=true]:outline-0 data-[focus=true]:ring-2 data-[focus=true]:ring-indicator-primary web:cursor-pointer disabled:cursor-not-allowed data-[disabled=true]:opacity-40 data-[invalid=true]:border-error-700 data-[invalid=true]:rounded-xl data-[invalid=true]:border-2", import("tailwind-variants/dist/config").TVConfig<{
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}, {
    size: {
        sm: string;
        md: string;
        lg: string;
    };
}>, unknown, unknown, undefined>>;
type ISwitchProps = React.ComponentProps<typeof UISwitch> & VariantProps<typeof switchStyle>;
declare const Switch: React.ForwardRefExoticComponent<Omit<ISwitchProps, "ref"> & React.RefAttributes<unknown>>;
export { Switch };
