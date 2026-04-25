import React, { useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import dayjs from "dayjs";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { formatCurrency } from "@/lib/utils";
import "@/global.css";

const SafeAreaView = styled(RNSafeAreaView);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CHART_H = 120;

export default function Insights() {
  const { subscriptions } = useSubscriptions();

  const today = dayjs();
  const todayDow = today.day();
  const todayIndex = todayDow === 0 ? 6 : todayDow - 1;

  const barData = useMemo(() => {
    const daily = new Array(7).fill(0);
    subscriptions.forEach((s) => {
      if (!s.renewalDate) return;
      const d = dayjs(s.renewalDate);
      if (!d.isValid()) return;
      const dow = d.day();
      const idx = dow === 0 ? 6 : dow - 1;
      daily[idx] += s.billing === "Yearly" ? s.price / 12 : s.price;
    });
    return daily;
  }, [subscriptions]);

  const maxVal = Math.max(...barData, 1);

  const monthlyTotal = useMemo(
    () =>
      subscriptions.reduce(
        (sum, s) => sum + (s.billing === "Yearly" ? s.price / 12 : s.price),
        0,
      ),
    [subscriptions],
  );

  const history = useMemo(
    () =>
      [...subscriptions].sort((a, b) =>
        dayjs(b.renewalDate).diff(dayjs(a.renewalDate)),
      ),
    [subscriptions],
  );

  const monthLabel = today.format("MMMM YYYY");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-5 pt-6 pb-10">
          <Text className="text-2xl font-sans-bold text-primary mb-6">
            Monthly Insights
          </Text>

          {/* Upcoming */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-sans-bold text-primary">
              Upcoming
            </Text>
            <View className="rounded-full border border-black/20 px-4 py-1">
              <Text className="text-lg font-sans-semibold text-primary">
                View all
              </Text>
            </View>
          </View>

          {/* Bar chart */}
          <View className="rounded-3xl border border-border bg-card p-5 mb-4">
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                height: CHART_H + 36,
              }}
            >
              {barData.map((val, i) => {
                const isToday = i === todayIndex;
                const barH =
                  val > 0
                    ? Math.max((val / maxVal) * CHART_H, 14)
                    : isToday
                      ? 8
                      : 4;
                return (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isToday && val > 0 && (
                      <View
                        style={{
                          backgroundColor: "#fff8e7",
                          borderWidth: 1,
                          borderColor: "rgba(0,0,0,0.12)",
                          borderRadius: 10,
                          paddingHorizontal: 7,
                          paddingVertical: 3,
                          marginBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: "sans-bold",
                            color: "#081126",
                          }}
                        >
                          ${val.toFixed(0)}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        height: barH,
                        width: "65%",
                        borderRadius: 6,
                        backgroundColor: isToday ? "#ea7a53" : "#081126",
                      }}
                    />
                    <Text
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        fontFamily: "sans-medium",
                        color: isToday ? "#ea7a53" : "rgba(0,0,0,0.5)",
                      }}
                    >
                      {DAYS[i]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Expenses card */}
          <View className="rounded-3xl border border-border bg-card px-5 py-5 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-sans-bold text-primary">
                  Expenses
                </Text>
                <Text className="text-sm font-sans-medium text-muted-foreground mt-0.5">
                  {monthLabel}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xl font-sans-bold text-primary">
                  -{formatCurrency(monthlyTotal)}
                </Text>
                <Text className="text-sm font-sans-semibold text-success mt-0.5">
                  +12%
                </Text>
              </View>
            </View>
          </View>

          {/* History */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-sans-bold text-primary">
              History
            </Text>
            <View className="rounded-full border border-black/20 px-4 py-1">
              <Text className="text-lg font-sans-semibold text-primary">
                View all
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            {history.map((sub) => (
              <View
                key={sub.id}
                className="rounded-2xl border border-border p-4"
                style={sub.color ? { backgroundColor: sub.color } : undefined}
              >
                <View className="flex-row items-center justify-between">
                  <View
                    className="flex-row items-center flex-1 min-w-0"
                    style={{ gap: 12 }}
                  >
                    <Image
                      source={sub.icon}
                      style={{ width: 44, height: 44, borderRadius: 12 }}
                    />
                    <View className="flex-1 min-w-0">
                      <Text
                        className="text-base font-sans-bold text-primary"
                        numberOfLines={1}
                      >
                        {sub.name}
                      </Text>
                      <Text
                        className="text-xs font-sans-medium text-muted-foreground mt-0.5"
                        numberOfLines={1}
                      >
                        {sub.renewalDate
                          ? dayjs(sub.renewalDate).format("MMMM D, HH:mm")
                          : ""}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end ml-3">
                    <Text className="text-base font-sans-bold text-primary">
                      {formatCurrency(
                        sub.billing === "Yearly" ? sub.price / 12 : sub.price,
                        sub.currency,
                      )}
                    </Text>
                    <Text className="text-xs font-sans-medium text-muted-foreground mt-0.5">
                      per month
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
