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
import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";

type Step = "register" | "verify";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleRegister = async () => {
    setLocalError("");

    if (!email || !password || !confirmPassword) {
      setLocalError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;

    await signUp.verifications.sendEmailCode();
    setStep("verify");
  };

  const handleVerify = async () => {
    setLocalError("");

    if (!code) {
      setLocalError("Please enter the verification code.");
      return;
    }

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as Href);
        },
      });
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
                title="Check your email"
                subtitle={`We sent a 6-digit code to\n${email}`}
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
                      {isLoading ? "Verifying…" : "Verify email"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Didn't receive it?</Text>
                <Pressable onPress={() => signUp.verifications.sendEmailCode()}>
                  <Text className="auth-link">Resend code</Text>
                </Pressable>
              </View>

              <View className="auth-link-row">
                <Pressable onPress={() => { setStep("register"); setCode(""); setLocalError(""); }}>
                  <Text className="auth-link">← Back to sign up</Text>
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
              title="Create account"
              subtitle="Track every subscription, never miss a renewal."
            />

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.emailAddress ? " auth-input-error" : ""}`}
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
                  {errors?.fields?.emailAddress ? (
                    <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                  ) : null}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input${errors?.fields?.password ? " auth-input-error" : ""}`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="rgba(8,17,38,0.3)"
                    secureTextEntry
                    textContentType="newPassword"
                    autoComplete="new-password"
                  />
                  {errors?.fields?.password ? (
                    <Text className="auth-error">{errors.fields.password.message}</Text>
                  ) : null}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Confirm password</Text>
                  <TextInput
                    className={`auth-input${localError && password !== confirmPassword ? " auth-input-error" : ""}`}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor="rgba(8,17,38,0.3)"
                    secureTextEntry
                    textContentType="newPassword"
                    autoComplete="new-password"
                  />
                </View>

                {localError ? (
                  <Text className="auth-error">{localError}</Text>
                ) : null}

                <Pressable
                  className={`auth-button${isLoading || !email || !password || !confirmPassword ? " auth-button-disabled" : ""}`}
                  onPress={handleRegister}
                  disabled={isLoading || !email || !password || !confirmPassword}
                >
                  <Text className="auth-button-text">
                    {isLoading ? "Creating account…" : "Create account"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>

            {/* Required by Clerk for bot protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
