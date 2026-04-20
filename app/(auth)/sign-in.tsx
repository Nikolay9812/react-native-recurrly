import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";

type Step = "credentials" | "verify";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");

  const isLoading = fetchStatus === "fetching";

  const finalize = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        router.replace(decorateUrl("/") as Href);
      },
    });
  };

  const handleSignIn = async () => {
    setLocalError("");

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) return;

    if (signIn.status === "complete") {
      await finalize();
    } else if (signIn.status === "needs_client_trust") {
      const emailFactor = signIn.supportedSecondFactors?.find(
        (f: { strategy: string }) => f.strategy === "email_code"
      );
      if (emailFactor) {
        await signIn.mfa.sendEmailCode();
        setStep("verify");
      }
    }
  };

  const handleVerify = async () => {
    setLocalError("");

    if (!code) {
      setLocalError("Please enter the verification code.");
      return;
    }

    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await finalize();
    }
  };

  const BrandBlock = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">R</Text>
        </View>
        <View>
          <Text className="auth-wordmark">Recurrly</Text>
          <Text className="auth-wordmark-sub">Subscription Tracker</Text>
        </View>
      </View>
      <Text className="auth-title">{title}</Text>
      <Text className="auth-subtitle">{subtitle}</Text>
    </View>
  );

  if (step === "verify") {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <BrandBlock
                title="Verify your identity"
                subtitle={`Enter the code we sent to\n${email}`}
              />

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={`auth-input${errors?.fields?.code ? " auth-input-error" : ""}`}
                      value={code}
                      onChangeText={setCode}
                      placeholder="000000"
                      placeholderTextColor="rgba(8,17,38,0.3)"
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      autoComplete="one-time-code"
                      maxLength={6}
                      autoFocus
                    />
                    {errors?.fields?.code ? (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    ) : null}
                    {localError ? (
                      <Text className="auth-error">{localError}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    className={`auth-button${isLoading || !code ? " auth-button-disabled" : ""}`}
                    onPress={handleVerify}
                    disabled={isLoading || !code}
                  >
                    <Text className="auth-button-text">
                      {isLoading ? "Verifying…" : "Verify"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Didn't receive it?</Text>
                <Pressable onPress={() => signIn.mfa.sendEmailCode()}>
                  <Text className="auth-link">Resend code</Text>
                </Pressable>
              </View>

              <View className="auth-link-row">
                <Pressable
                  onPress={() => {
                    signIn.reset();
                    setStep("credentials");
                    setCode("");
                    setLocalError("");
                  }}
                >
                  <Text className="auth-link">← Back</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            <BrandBlock
              title="Welcome back"
              subtitle="Sign in to continue tracking your subscriptions."
            />

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.identifier ? " auth-input-error" : ""}`}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(8,17,38,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                  />
                  {errors?.fields?.identifier ? (
                    <Text className="auth-error">{errors.fields.identifier.message}</Text>
                  ) : null}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.password ? " auth-input-error" : ""}`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Your password"
                    placeholderTextColor="rgba(8,17,38,0.3)"
                    secureTextEntry
                    textContentType="password"
                    autoComplete="current-password"
                  />
                  {errors?.fields?.password ? (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  ) : null}
                </View>

                {localError ? (
                  <Text className="auth-error">{localError}</Text>
                ) : null}

                <Pressable
                  className={`auth-button${isLoading || !email || !password ? " auth-button-disabled" : ""}`}
                  onPress={handleSignIn}
                  disabled={isLoading || !email || !password}
                >
                  <Text className="auth-button-text">
                    {isLoading ? "Signing in…" : "Sign in"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Sign up</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
