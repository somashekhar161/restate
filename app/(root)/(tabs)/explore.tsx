import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import seed from "@/lib/seed";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: Properties,
    loading: PropertiesLoading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    },
    skip: true,
  });
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={Properties}
        renderItem={({ item, index }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id.toString()}
        contentContainerClassName="pb-32 "
        columnWrapperClassName=" flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        numColumns={2}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          PropertiesLoading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 justify-center items-center "
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search for Your Ideal Home
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            <Search />
            <View className="mt-5 ">
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {Properties?.length} Properties
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
