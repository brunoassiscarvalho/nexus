import React from 'react';
import { createIcon } from '@gluestack-ui/icon';
import { Svg } from 'react-native-svg';
import { VariantProps } from '@gluestack-ui/nativewind-utils';
type IPrimitiveIcon = {
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
export declare const UIIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<(IPrimitiveIcon & React.RefAttributes<Svg>) | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const iconStyle: import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
} | ({
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
} & {
    size: {
        '2xs': import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        xs: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        sm: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        md: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        lg: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
        xl: import("tailwind-merge").ClassNameValue | {
            base?: import("tailwind-merge").ClassNameValue;
        };
    };
}), undefined, "text-typography-950 fill-none", import("tailwind-variants/dist/config").TVConfig<{
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}, {
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}>, {
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}, undefined, import("@gluestack-ui/nativewind-utils/types").TVReturnType<{
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}, undefined, "text-typography-950 fill-none", import("tailwind-variants/dist/config").TVConfig<{
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}, {
    size: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}>, unknown, unknown, undefined>>;
type IIConProps = IPrimitiveIcon & VariantProps<typeof iconStyle> & React.ComponentPropsWithoutRef<typeof UIIcon>;
export declare const Icon: React.ForwardRefExoticComponent<IIConProps & React.RefAttributes<Svg>>;
type ParameterTypes = Omit<Parameters<typeof createIcon>[0], 'Root'>;
declare const createIconUI: ({ ...props }: ParameterTypes) => React.ForwardRefExoticComponent<React.RefAttributes<Svg>>;
export { createIconUI as createIcon };
declare const AddIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { AddIcon };
declare const AlertCircleIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { AlertCircleIcon };
declare const ArrowUpIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ArrowDownIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ArrowRightIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ArrowLeftIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, ArrowLeftIcon };
declare const AtSignIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { AtSignIcon };
declare const BellIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { BellIcon };
declare const CalendarDaysIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { CalendarDaysIcon };
declare const CheckIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const CheckCircleIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { CheckIcon, CheckCircleIcon };
declare const ChevronUpIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ChevronDownIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ChevronLeftIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ChevronRightIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ChevronsLeftIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ChevronsRightIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ChevronsUpDownIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, ChevronsUpDownIcon, };
declare const CircleIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { CircleIcon };
declare const ClockIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { ClockIcon };
declare const CloseIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const CloseCircleIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { CloseIcon, CloseCircleIcon };
declare const CopyIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { CopyIcon };
declare const DownloadIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { DownloadIcon };
declare const EditIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { EditIcon };
declare const EyeIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const EyeOffIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { EyeIcon, EyeOffIcon };
declare const FavouriteIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { FavouriteIcon };
declare const GlobeIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { GlobeIcon };
declare const GripVerticalIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { GripVerticalIcon };
declare const HelpCircleIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { HelpCircleIcon };
declare const InfoIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { InfoIcon };
declare const LinkIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const ExternalLinkIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { LinkIcon, ExternalLinkIcon };
declare const LoaderIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { LoaderIcon };
declare const LockIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { LockIcon };
declare const MailIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { MailIcon };
declare const MenuIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { MenuIcon };
declare const MessageCircleIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { MessageCircleIcon };
declare const MoonIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { MoonIcon };
declare const PaperclipIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { PaperclipIcon };
declare const PhoneIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { PhoneIcon };
declare const PlayIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { PlayIcon };
declare const RemoveIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { RemoveIcon };
declare const RepeatIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
declare const Repeat1Icon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { RepeatIcon, Repeat1Icon };
declare const SearchIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { SearchIcon };
declare const SettingsIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { SettingsIcon };
declare const ShareIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { ShareIcon };
declare const SlashIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { SlashIcon };
declare const StarIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { StarIcon };
declare const SunIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { SunIcon };
declare const ThreeDotsIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { ThreeDotsIcon };
declare const TrashIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { TrashIcon };
declare const UnlockIcon: import("@gluestack-ui/icon/lib/typescript/createIcon").IIconComponentType<import("react-native-svg").SvgProps | {
    fill?: import("react-native").ColorValue | undefined;
    stroke?: import("react-native").ColorValue | undefined;
}>;
export { UnlockIcon };
