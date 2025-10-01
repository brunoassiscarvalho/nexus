import React from 'react';
import { Text, View } from 'react-native';
type ITableHeadProps = React.ComponentProps<typeof View | typeof Text> & {
    useRNView?: boolean;
};
type ITableDataProps = React.ComponentProps<typeof View | typeof Text> & {
    useRNView?: boolean;
};
declare const Table: React.ForwardRefExoticComponent<Omit<import("@expo/html-elements/build/primitives/View").WebViewProps & Omit<import("react-native").ViewProps & React.ClassAttributes<typeof View>, "style">, "ref"> & React.RefAttributes<typeof View | React.Component<import("@expo/html-elements/build/primitives/View").ViewProps, any, any>>>;
declare const TableHeader: React.ForwardRefExoticComponent<Omit<import("@expo/html-elements/build/primitives/View").WebViewProps & Omit<import("react-native").ViewProps & React.ClassAttributes<typeof View>, "style">, "ref"> & React.RefAttributes<typeof View | React.Component<import("@expo/html-elements/build/primitives/View").ViewProps, any, any>>>;
declare const TableBody: React.ForwardRefExoticComponent<Omit<import("@expo/html-elements/build/primitives/View").WebViewProps & Omit<import("react-native").ViewProps & React.ClassAttributes<typeof View>, "style">, "ref"> & React.RefAttributes<typeof View | React.Component<import("@expo/html-elements/build/primitives/View").ViewProps, any, any>>>;
declare const TableFooter: React.ForwardRefExoticComponent<Omit<import("@expo/html-elements/build/primitives/View").WebViewProps & Omit<import("react-native").ViewProps & React.ClassAttributes<typeof View>, "style">, "ref"> & React.RefAttributes<typeof View | React.Component<import("@expo/html-elements/build/primitives/View").ViewProps, any, any>>>;
declare const TableHead: React.ForwardRefExoticComponent<ITableHeadProps & React.RefAttributes<View | Text>>;
declare const TableRow: React.ForwardRefExoticComponent<Omit<import("@expo/html-elements/build/primitives/View").WebViewProps & Omit<import("react-native").ViewProps & React.ClassAttributes<typeof View>, "style">, "ref"> & React.RefAttributes<typeof View | React.Component<import("@expo/html-elements/build/primitives/View").ViewProps, any, any>>>;
declare const TableData: React.ForwardRefExoticComponent<ITableDataProps & React.RefAttributes<View | Text>>;
declare const TableCaption: React.ForwardRefExoticComponent<Omit<Omit<import("react-native").TextProps & React.ClassAttributes<typeof Text>, "style"> & import("@expo/html-elements/build/primitives/Text").WebTextProps, "ref"> & React.RefAttributes<typeof Text | React.Component<import("@expo/html-elements/build/primitives/Text").TextProps, any, any>>>;
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableData, TableCaption, };
