import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useGlobalContext } from "@/lib/global-provider";

export default function BottomSheetContent() {
  const {
    bottomSheetRef,

    handleSheetChange,
    snapPoints,
    handleSheetClosePress,
  } = useGlobalContext();

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
      ...styles.sheetContainerShadow,
    }),
    ["#000"]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      enablePanDownToClose
      handleComponent={() => (
        <View className="rounded border-t border-t-black-100"></View>
      )}
      index={-1}
      style={sheetStyle}
    >
      <BottomSheetView style={styles.sheetContainer}>
        <TouchableOpacity onPress={handleSheetClosePress}>
          <Text>Close</Text>
        </TouchableOpacity>
        <Text>Awesome 🔥</Text>
      </BottomSheetView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 24,
  },
  sheetContainer: {
    backgroundColor: "white",
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
  },
  sheetContainerShadow: Platform.select({
    ios: {
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.75,
      shadowRadius: 16.0,
      shadowColor: "#000",
    },
    android: {
      elevation: 24,
    },
    web: {
      boxShadow: "0px -4px 16px rgba(0,0,0, 0.25)",
    },
  }) as any,
});
