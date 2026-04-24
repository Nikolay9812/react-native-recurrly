import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim();
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim();

const isConfigured =
  !!apiKey && apiKey !== "" && apiKey !== "phc_your_posthog_api_key_here";

if (!isConfigured) {
  console.warn(
    "PostHog API key not configured. Analytics disabled. " +
      "Set EXPO_PUBLIC_POSTHOG_API_KEY in your .env file.",
  );
}

export const posthog = new PostHog(apiKey ?? "placeholder", {
  ...(host ? { host } : {}),
  disabled: !isConfigured,
  captureAppLifecycleEvents: true,
  flushAt: 20,
  flushInterval: 10_000,
  maxBatchSize: 100,
  maxQueueSize: 1_000,
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10_000,
  requestTimeout: 10_000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3_000,
});
