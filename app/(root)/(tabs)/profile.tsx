import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGlobalContext } from "@/lib/global-provider";
import { settings } from "@/constants/data";
import { logout } from "@/lib/appwrite";
interface SettingItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}
const SettingItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className=" flex flex-row items-center justify-between py-3"
  >
    <View className=" flex flex-row items-center gap-3">
      <Image source={icon} className=" size-6 " />
      <Text
        className={` text-lg font-rubik-medium text-black-300 ${textStyle}`}
      >
        {title}
      </Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className=" size-5" />}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();
  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Success", "You have been logged out");
      refetch();
    } else Alert.alert("Error", "An Error Occured while loggin out");
  };
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7 pt-2"
      >
        <View className="flex justify-between items-center flex-row">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>
        <View className="flex-row flex mt-5 justify-center">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar }}
              className="rounded-full size-44"
            />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9 " />
            </TouchableOpacity>
            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>
        <View className="flex flex-col mt-10">
          <SettingItem
            icon={icons.calendar}
            title="My Bookings"
            onPress={() => {}}
          />
          <SettingItem
            icon={icons.wallet}
            title="Payments"
            onPress={() => {}}
          />
        </View>
        <View className="flex flex-col   border-t mt-5 pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingItem key={index} {...item} />
          ))}
        </View>
        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingItem
            icon={icons.logout}
            title="Logout"
            onPress={handleLogout}
            showArrow={false}
            textStyle="text-danger"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
