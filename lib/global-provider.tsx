import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useAppwrite } from "./useAppwrite";
import { getCurrentUser } from "./appwrite";
import { replace } from "expo-router/build/global-state/routing";

import { StyleSheet, View, Text, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null | undefined;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;

  // bottom-sheet
  bottomSheetRef: any;
  snapPoints: string[];
  handleSheetChange: (index: number) => void;

  handleSheetClosePress: () => void;
  handleSheetOpenPress: () => void;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser });

  const isLoggedIn = !!user;

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSheetClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleSheetOpenPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetch,

        // bottom-sheet
        bottomSheetRef,
        handleSheetClosePress,
        handleSheetOpenPress,
        handleSheetChange,
        snapPoints,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};

export default GlobalProvider;
