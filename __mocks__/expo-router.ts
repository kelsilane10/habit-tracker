import React from 'react';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  navigate: jest.fn(),
}));

export const useLocalSearchParams = jest.fn(() => ({}));
export const useSegments = jest.fn(() => []);
export const Link = ({ children }: { children: React.ReactNode }) => children as React.ReactElement;
export const Stack = { Screen: () => null };
export const Tabs = { Screen: () => null };
