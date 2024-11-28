import React, { useEffect, useState, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native";
import { lightTheme, darkTheme } from "@/constants/THEMES";
import ThemeContext from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import GIF from "@/components/GIF";

const Home = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [trendingGIFs, setTrendingGIFs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const nextPageIdentifierRef = useRef(true);

  // Choose the current theme
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // Fetch trending GIFs
  const fetchTrendingGIFs = async () => {
    if (!nextPageIdentifierRef.current || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?limit=5&offset=${
          currentPage * 5
        }&api_key=${process.env.EXPO_PUBLIC_API_KEY}`
      );
      const data = await response.json();
      const formattedData = formatGIFData(data.data);
      setTrendingGIFs((prev) => [...prev, ...formattedData]);

      nextPageIdentifierRef.current =
        data.pagination.total_count >
        trendingGIFs.length + formattedData.length;
    } catch (error) {
      console.error("Error fetching GIFs => ", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  // Fetch searched GIFs
  const fetchSearchedGIFs = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?q=${query}&limit=5&api_key=${process.env.EXPO_PUBLIC_API_KEY}`
      );
      const data = await response.json();
      const formattedData = formatGIFData(data.data);
      setTrendingGIFs(formattedData);
    } catch (error) {
      console.error("Error searching GIFS => ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only Extracting gif url from  response data
  const formatGIFData = (data: any[]) =>
    data.map((gif: any) => ({
      url: gif.images.fixed_height.url,
    }));

  // changing offeset whenever user reach end of flatlist
  const fetchNextPage = () => {
    if (!nextPageIdentifierRef.current || isFetchingNextPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (searchQuery.length === 0) {
      fetchTrendingGIFs();
    }
  }, [currentPage]);

  // Debouncing - Reducing number of API Calls with delay of 1 second
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery) {
        fetchSearchedGIFs(searchQuery);
      } else {
        setCurrentPage(0);
      }
    }, 1000);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: currentTheme.textColor }]}>
          Trending GIFs
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: currentTheme.switchTrackColor }}
          onValueChange={toggleTheme}
          value={isDarkMode}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Trending GIFs"
          placeholderTextColor={currentTheme.placeholderColor}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchInput,
            {
              borderColor: currentTheme.borderColor,
              color: currentTheme.textColor,
              backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
            },
          ]}
        />
      </View>
      <FlatList
        data={trendingGIFs}
        renderItem={({ item }) => <GIF item={item} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          isFetchingNextPage || isLoading ? (
            <ActivityIndicator size="large" />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});
