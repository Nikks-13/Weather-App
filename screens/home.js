import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ProgressBarAndroidBase,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../Theme/theme";
import * as Animatable from "react-native-animatable";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocation, fetchWeatherForcast } from "../API/weather";
import { weatherImages } from "../constants/constants";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncstorage";

export default function Home() {
  const [show, setShow] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    setLocations([]);
    setShow(false);
    setLoading(true);
    fetchWeatherForcast({
      cityName: loc.name,
      days: "8",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", loc.name);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocation({ cityName: value }).then((data) => {
        setLocations(data);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherForcast();
  }, []);

  const fetchMyWeatherForcast = async () => {
    let mycity = await getData("city");
    let cityName = "mumbai";
    if (mycity) {
      cityName = mycity;
    }

    fetchWeatherForcast({
      cityName,
      days: "8",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute w-full h-full"
      />

      {loading ? (
        <View className=" flex-1 flex-col justify-center items-center ">
          <Progress.CircleSnail thickness={15} size={140} color={"white"} />
          <Text className="text-white mt-5 font-bold text-lg ">Fetching data</Text>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* searching area */}
          <View style={{ height: "10%" }} className=" mx-4 relative z-50  ">
            <View
              className="flex-row justify-end items-center rounded-full"
              style={{
                backgroundColor: show ? theme.bgWhite(0.2) : "transparent",
              }}
            >
              {show ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="search city"
                  placeholderTextColor={"lightgray"}
                  className="pl-6 h-10 pb-1 flex-1 text-lg text-white "
                />
              ) : null}

              <TouchableOpacity
                onPress={() => setShow(!show)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="rounded-full p-2 m-1 "
              >
                <MagnifyingGlassIcon size={25} color={"white"} />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && show ? (
              <View className=" absolute w-full bg-gray-300 top-16 rounded-3xl ">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      className={
                        "   flex-row items-center border-0 p-3 px-4 mb-1  " +
                        borderClass
                      }
                    >
                      <MapPinIcon size={20} color={"gray"} />
                      <Text className="text-black text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* forcast section*/}
          <View className=" mx-4 flex justify-around  flex-1 mb-2">
            {/* location*/}
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name}
              <Text className=" text-lg font-semibold text-gray-300 ">
                {" " + location?.country}
              </Text>
            </Text>

            {/* weather image*/}
            <View className="flex-row justify-center ">
              <Image
                source={weatherImages[current?.condition?.text]}
                className=" w-52 h-52 "
              />
            </View>

            {/* degree selcius*/}
            <View className="Space-y-2">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center  text-white text-xl ml-5">
                {current?.condition?.text}
              </Text>
            </View>

            {/* more stats*/}
            <View className="flex-row justify-evenly mx-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className=" h-6 w-6"
                />
                <Text className=" text-white font-semibold  text-base">
                  {current?.wind_kph}km
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className=" h-6 w-6"
                />
                <Text className=" text-white font-semibold  text-base">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className=" h-6 w-6"
                />
                <Text className=" text-white font-semibold  text-base">
                  { weather?.forecast?.forecastday[0]?.astro?.sunrise }
                </Text>
              </View>
            </View>
          </View>

          {/* forcast section for next days*/}
          <View className=" mb-2 space-y-3 ">
            <View className=" flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={22} color={"white"} />
              <Text className="text-white text-base">DAILY FORCAST</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.slice(1).map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-uS", options);
                dayName = dayName.split(",")[0];
                return (
                  <View
                    key={item} 
                    className=" flex  justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      className="h-11 w-11"
                    />
                    <Text className="text-white ">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold ">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
