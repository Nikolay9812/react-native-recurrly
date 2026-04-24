import "@/global.css";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useState, useMemo } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q),
    );
  }, [query, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="subs-title">Subscriptions</Text>

      <TextInput
        className="subs-search"
        placeholder="Search subscriptions..."
        placeholderTextColor="rgba(0,0,0,0.4)"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId((current) => (current === item.id ? null : item.id))
            }
          />
        )}
        extraData={expandedId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions found.</Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
