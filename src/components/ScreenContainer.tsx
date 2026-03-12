import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

// Define styled components outside the render cycle
const StyledSafeArea = withUniwind(SafeAreaView);
const StyledView = withUniwind(View);

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  useSafeArea?: boolean;
}

const ScreenContainer = ({
  children,
  className,
  useSafeArea = false, // Default to false or true based on your preference
}: ScreenContainerProps) => {
  // Select the component based on the prop
  const Container = useSafeArea ? StyledSafeArea : StyledView;

  return <Container className={cn('flex-1 px-4 pt-2', className)}>{children}</Container>;
};

export default ScreenContainer;
