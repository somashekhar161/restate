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
const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: LatestProperties, loading: LatestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });
  const {
    data: Properties,
    loading: PropertiesLoading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
    skip: true,
  });
  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
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
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full "
                />
                <View className=" flex flex-col items-start ml-2 justify-center">
                  <Text className=" text-xs font-rubik text-black-100">
                    {getGreeting()}
                  </Text>
                  <Text className="text-base font-rubik-medium text-black-300">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />

            {LatestPropertiesLoading ? (
              <ActivityIndicator
                size="large"
                className="text-primary-300 mt-5"
              />
            ) : !LatestProperties || LatestProperties.length === 0 ? (
              <NoResults />
            ) : (
              <View className="mt-5 ">
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-xl font-rubik-bold text-black-300">
                    Featured
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-base font-rubik-bold text-primary-300">
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={LatestProperties}
                  renderItem={({ item, index }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  horizontal
                  keyExtractor={(item) => item.$id.toString()}
                  contentContainerClassName="flex flex-row gap-5 mt-5"
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            <View className="mt-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recomendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <Filters />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
