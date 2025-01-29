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

const facilityIcons = {
  Laundry: { title: "Laundry", icon: icons.laundry },
  "Car Parking": { title: "Car Parking", icon: icons.carPark },
  "Sports Center": { title: "Sports Center", icon: icons.run },
  Cutlery: { title: "Restaurant", icon: icons.cutlery },
  Gym: { title: "Gym & Fitness", icon: icons.dumbell },
  "Swimming pool": { title: "Swimming pool", icon: icons.swim },
  Wifi: { title: "Wifi & Network", icon: icons.wifi },
  "Pet-Friendly": { title: "Pet Center", icon: icons.dog },
};
const Property = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: { id: id! },
  });
  const width = Dimensions.get("window").width;
  const progress = useSharedValue<number>(0);

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
        contentContainerClassName=" bg-white "
      >
        {property?.gallery && property?.gallery.length > 1 ? (
          <View className="relative">
            <Carousel
              loop
              ref={ref}
              onProgressChange={progress}
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

            <Pagination.Custom<{ color: string }>
              progress={progress}
              data={property.gallery}
              size={20}
              dotStyle={{
                borderRadius: 16,
                width: 8,
                height: 8,
                backgroundColor: "#f1f1f1",
              }}
              activeDotStyle={{
                borderRadius: 8,
                width: 32,
                height: 8,
                overflow: "hidden",
                backgroundColor: "#0061FF",
              }}
              containerStyle={{
                gap: 5,
                marginBottom: 10,
                alignItems: "center",
                position: "absolute",
                bottom: 5,
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
          </View>
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
          className="absolute top-0 w-full  h-14 opacity-60 z-40"
        />
        <View
          className="z-50 absolute top-0 inset-x-7"
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
        <View className="px-7 ">
          <View className="border-b-2 py-8 border-b-primary-200">
            <Text className="font-rubik-extrabold text-2xl">
              {property?.name}
            </Text>
            <View className="flex flex-row  gap-2 items-center mt-4">
              <View className="p-1.5 px-3.5 bg-primary-200 rounded-full">
                <Text className="text-primary-300 font-rubik-semibold ">
                  {property?.type}
                </Text>
              </View>

              <Image source={icons.star} />
              <Text className="text-black-200 font-rubik-medium">
                {property?.rating} ( {property?.reviews.length} reviews )
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center mt-4">
              {/* PROPERTIES */}
              <View className="flex flex-row items-center gap-2 ">
                <View className="rounded-full p-4 bg-primary-200 size-fit ">
                  <Image source={icons.bed} className="w-4 h-4" />
                </View>
                <Text className="text-black font-rubik-bold text-base">
                  {property?.bedrooms} Beds
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 ">
                <View className="rounded-full p-4 bg-primary-200 size-fit ">
                  <Image source={icons.bath} className="w-4 h-4" />
                </View>
                <Text className="text-black font-rubik-bold text-base">
                  {property?.bathrooms} bath
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2 ">
                <View className="rounded-full p-4 bg-primary-200 size-fit ">
                  <Image source={icons.area} className="w-4 h-4" />
                </View>
                <Text className="text-black font-rubik-bold text-base">
                  {property?.area} sqft
                </Text>
              </View>
              {/* EOF PROPERTIES */}
            </View>
          </View>
          <View className="py-4">
            <Text className="text-xl font-rubik-bold my-4">Agent</Text>
            <View className=" flex flex-row items-center">
              <Image
                source={{ uri: property?.agent.avatar }}
                className="h-16 w-16 rounded-full"
              />
              <View className="flex flex-grow px-4">
                <Text className="font-rubik-bold text-xl">
                  {property?.agent.name}
                </Text>
                <Text className="text-black-200 font-rubik-medium text-base">
                  Owner
                </Text>
              </View>
              <View className="flex flex-row items-center gap-4">
                <Image source={icons.chat} className="size-8" />
                <Image source={icons.phone} className="size-8" />
              </View>
            </View>
          </View>
          <View className="py-4">
            <Text className="text-xl font-rubik-bold my-4">Overview</Text>
            <Text className="text-base font-rubik text-black-200">
              {property?.description}
            </Text>
          </View>
          <View className="py-4 ">
            <Text className="text-xl font-rubik-bold my-4 ">Facilities</Text>

            {property?.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property?.facilities.map(
                  (facility: keyof typeof facilityIcons, index: number) => {
                    if (facility in facilityIcons)
                      return (
                        <View
                          key={index}
                          className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                        >
                          <View className="p-6 rounded-full bg-primary-200 ">
                            <Image
                              source={facilityIcons[facility].icon}
                              className="w-7 h-7"
                            />
                          </View>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-black-300 text-sm text-center font-rubik mt-1.5"
                          >
                            {facilityIcons[facility].title}
                          </Text>
                        </View>
                      );
                  }
                )}
              </View>
            )}
          </View>
          <View className="py-4">
            <Text className="text-xl font-rubik-bold ">Gallery</Text>
            <View className=" flex flex-row items-center justify-between mt-2 ">
              {property?.gallery.length > 0 &&
                property?.gallery.map(
                  (galleryitem: { image: string }, index: number) => {
                    if (index > 2) return;
                    if (index == 2)
                      return (
                        <View className="relative">
                          <Image
                            source={{ uri: galleryitem.image }}
                            className="size-28 rounded-2xl"
                          />
                          <View className="bg-black-100/30 backdrop-blur-xl size-28 flex items-center justify-center rounded-2xl absolute  ">
                            <Text className=" text-white font-rubik-bold text-xl">
                              {property?.gallery.length - 2}+
                            </Text>
                          </View>
                        </View>
                      );
                    return (
                      <Image
                        source={{ uri: galleryitem.image }}
                        className="size-28 rounded-2xl"
                      />
                    );
                  }
                )}
            </View>
          </View>
          <View className="py-4">
            <Text className="text-xl font-rubik-bold ">Location</Text>
            <View className=" flex flex-row items-start gap-4 mt-2">
              <Image source={icons.location} className="size-6" />
              <Text className="text-lg text-black-200 font-rubik-medium ">
                {property?.address}
              </Text>
            </View>
            <Image
              source={images.map}
              className="h-52 w-full mt-4 rounded-xl"
            />
          </View>

          <View className="py-4 ">
            <View className=" flex flex-row items-center ">
              <Image source={icons.star} className="size-7"></Image>
              <Text className="flex-1 ml-2 text-black-300 font-semibold text-xl">
                {property?.rating} ({property?.reviews.length} reviews)
              </Text>
              <TouchableOpacity>
                <Text className=" text-primary-300 font-rubik-medium text-xl">
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {property?.reviews.length > 0 && (
            <View className="py-4">
              <View className="flex flex-row gap-4 items-center">
                <Image
                  source={{ uri: property?.reviews[0].avatar }}
                  className="rounded-full size-10"
                />
                <Text className="font-rubik-bold text-xl">
                  {property?.reviews[0].name}
                </Text>
              </View>
              <Text className="mt-4 font-rubik text-black-200 text-base">
                {property?.reviews[0].review}
              </Text>

              <View className=" flex items-center justify-between flex-row">
                <View className=" flex flex-row gap-2 items-center">
                  <Image
                    source={icons.heart}
                    className=" size-8"
                    tintColor={"#0061FF"}
                  />
                  <Text className=" font-rubik-bold text-base"> 938</Text>
                </View>
                <Text className="text-black-100 font-rubik-medium">
                  6 days ago
                </Text>
              </View>
            </View>
          )}
        </View>
        <View className="py-8 rounded-3xl border-t-2 border-x-2 border-t-primary-200 border-x-primary-200">
          <View className="px-7  flex flex-row items-center justify-between">
            <View className="  ">
              <Text className="font-rubik-medium text-black-100 tracking-tighter">
                P R I C E
              </Text>
              <Text className=" text-2xl text-primary-300 font-rubik-bold">
                $ {property?.price}
              </Text>
            </View>
            <TouchableOpacity className="bg-primary-300 rounded-full p-4 px-8">
              <Text className="text-base font-rubik-semibold text-white">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Property;
