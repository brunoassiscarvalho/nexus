import GorhomBottomSheet, { BottomSheetBackdrop as GorhomBottomSheetBackdrop, BottomSheetHandle } from '@gorhom/bottom-sheet';
import type { PressableProps, TextProps } from 'react-native';
import React from 'react';
type IBottomSheetProps = React.ComponentProps<typeof GorhomBottomSheet>;
export declare const BottomSheet: ({ snapToIndex, onOpen, onClose, ...props }: {
    snapToIndex?: number | undefined;
    children?: React.ReactNode;
    onOpen?: (() => void) | undefined;
    onClose?: (() => void) | undefined;
}) => import("react/jsx-runtime").JSX.Element;
export declare const BottomSheetPortal: ({ snapPoints, handleComponent: DragIndicator, backdropComponent: BackDrop, ...props }: any) => import("react/jsx-runtime").JSX.Element;
export declare const BottomSheetTrigger: ({ className, ...props }: PressableProps & {
    className?: string | undefined;
}) => import("react/jsx-runtime").JSX.Element;
type IBottomSheetBackdrop = React.ComponentProps<typeof GorhomBottomSheetBackdrop>;
export declare const BottomSheetBackdrop: ({ disappearsOnIndex, appearsOnIndex, className, ...props }: any) => import("react/jsx-runtime").JSX.Element;
type IBottomSheetDragIndicator = React.ComponentProps<typeof BottomSheetHandle>;
export declare const BottomSheetDragIndicator: ({ children, className, ...props }: any) => import("react/jsx-runtime").JSX.Element;
export declare const BottomSheetContent: ({ ...props }: any) => import("react/jsx-runtime").JSX.Element;
export declare const BottomSheetItem: ({ children, className, closeOnSelect, ...props }: PressableProps & {
    closeOnSelect?: boolean | undefined;
}) => import("react/jsx-runtime").JSX.Element;
export declare const BottomSheetItemText: ({ ...props }: TextProps) => import("react/jsx-runtime").JSX.Element;
export declare const BottomSheetScrollView: any;
export declare const BottomSheetFlatList: any;
export declare const BottomSheetSectionList: any;
export declare const BottomSheetTextInput: any;
export {};
