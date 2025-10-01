import React from 'react';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { textStyle } from './styles';
type ITextProps = React.ComponentProps<'span'> & VariantProps<typeof textStyle>;
declare const Text: React.ForwardRefExoticComponent<Omit<ITextProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;
export { Text };
