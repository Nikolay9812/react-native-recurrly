import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import "@/global.css";

const SafeAreaView = styled(RNSafeAreaView);

type RowProps = {
  label: string;
  value?: string;
};

const Row = ({ label, value }: RowProps) => (
  <View className="flex-row items-center justify-between py-4 border-b border-border">
    <Text className="text-base font-sans-medium text-primary">{label}</Text>
    {value ? (
      <Text className="text-sm font-sans-medium text-muted-foreground">{value}</Text>
    ) : (
      <Text className="text-muted-foreground font-sans-semibold text-lg">›</Text>
    )}
  </View>
);

export default function Settings() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : (user?.emailAddresses[0]?.emailAddress?.[0] ?? "?").toUpperCase();

  const displayName =
    user?.fullName ??
    user?.emailAddresses[0]?.emailAddress ??
    "User";

  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6 pb-10 flex-1">
          {/* Header */}
          <Text className="text-2xl font-sans-bold text-primary mb-6">Settings</Text>

          {/* Profile card */}
          <View className="rounded-3xl border border-border bg-card p-6 items-center mb-6">
            <View className="size-20 rounded-full bg-accent items-center justify-center mb-3">
              <Text className="text-2xl font-sans-extrabold text-background">
                {initials}
              </Text>
            </View>
            <Text className="text-xl font-sans-bold text-primary">{displayName}</Text>
            {email ? (
              <Text className="text-sm font-sans-medium text-muted-foreground mt-1">
                {email}
              </Text>
            ) : null}
          </View>

          {/* Account section */}
          <View className="rounded-3xl border border-border bg-card px-5 mb-4">
            <Text className="text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground pt-4 pb-2">
              Account
            </Text>
            <Row label="Edit profile" />
            <Row label="Change password" />
            <Row label="Email address" value={email} />
          </View>

          {/* Preferences section */}
          <View className="rounded-3xl border border-border bg-card px-5 mb-8">
            <Text className="text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground pt-4 pb-2">
              Preferences
            </Text>
            <Row label="Notifications" />
            <Row label="Currency" value="USD" />
            <Row label="Privacy & security" />
          </View>

          {/* Sign out */}
          <Pressable
            className="auth-button"
            onPress={handleSignOut}
          >
            <Text className="auth-button-text">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
