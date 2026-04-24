import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import "@/global.css";

const SafeAreaView = styled(RNSafeAreaView);

type RowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
};

const Row = ({ label, value, onPress }: RowProps) => {
  const inner = (
    <>
      <Text className="text-base font-sans-medium text-primary">{label}</Text>
      {value ? (
        <Text className="text-sm font-sans-medium text-muted-foreground">{value}</Text>
      ) : onPress ? (
        <Text className="text-muted-foreground font-sans-semibold text-lg">›</Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        className="flex-row items-center justify-between py-4 border-b border-border"
        onPress={onPress}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center justify-between py-4 border-b border-border">
      {inner}
    </View>
  );
};

export default function Settings() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

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
            <Image
              source={{ uri: user?.imageUrl }}
              className="size-20 rounded-full mb-3"
            />
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
