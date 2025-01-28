import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { getPropertyById } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";

import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel, { Pagination } from "react-native-reanimated-carousel";

import images from "@/constants/images";

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];
const Property = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! },
  });
  const width = Dimensions.get("window").width;
  const progress = useSharedValue<number>(0);
  const baseOptions = {
    vertical: false,
    width: width,
    height: width * 0.6,
  } as const;

  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  if (loading)
    <SafeAreaView>
      <ActivityIndicator />
    </SafeAreaView>;

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        {property?.gallery && property?.gallery.length > 0 ? (
          <>
            <Carousel
              loop
              ref={ref}
              onProgressChange={progress}
              defaultIndex={2}
              width={width}
              height={500}
              data={[...property?.gallery]}
              snapEnabled
              onSnapToItem={(index) =>
                console.log("current index:", index, property?.gallery[index])
              }
              renderItem={({
                item,
                index,
              }: {
                item: { image: string };
                index: number;
              }) => (
                <Image
                  source={{ uri: item?.image }}
                  defaultSource={{ uri: property?.image }}
                  className="size-full"
                  resizeMode="cover"
                />
              )}
            />
            {/* @ts-ignore  */}
            <Pagination.Custom
              progress={progress}
              data={property.gallery}
              size={20}
              dotStyle={{
                borderRadius: 16,
                backgroundColor: "#262626",
              }}
              activeDotStyle={{
                borderRadius: 8,
                width: 40,
                height: 30,
                overflow: "hidden",
                backgroundColor: "#f1f1f1",
              }}
              containerStyle={{
                gap: 5,
                marginBottom: 10,
                alignItems: "center",
                height: 10,
              }}
              horizontal
              onPress={onPressPagination}
              customReanimatedStyle={(progress, index, length) => {
                let val = Math.abs(progress - index);
                if (index === 0 && progress > length - 1) {
                  val = Math.abs(progress - length);
                }

                return {
                  transform: [
                    {
                      translateY: interpolate(
                        val,
                        [0, 1],
                        [0, 0],
                        Extrapolation.CLAMP
                      ),
                    },
                  ],
                };
              }}
            />
          </>
        ) : (
          <Image
            source={{ uri: property?.image }}
            height={500}
            width={width}
            resizeMode="cover"
          />
        )}
        <Image
          source={images.whiteGradient}
          className="absolute top-0 w-full z-40"
        />
        <View
          className="z-50 absolute inset-x-7"
          style={{
            top: Platform.OS === "ios" ? 70 : 20,
          }}
        >
          <View className="flex flex-row items-center w-full justify-between">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Image source={icons.backArrow} className="h-7 w-7" />
            </TouchableOpacity>
            <View className=" flex flex-row items-center  gap-4">
              <Image
                source={icons.heart}
                className="h-7 w-7 "
                tintColor={"#191D31"}
              />
              <Image source={icons.send} className="h-7 w-7" />
            </View>
          </View>
        </View>

        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Property;
