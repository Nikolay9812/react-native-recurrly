import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";
import { icons } from "@/constants/icons";
import { getBrandConfig } from "@/constants/brandIcons";
import { posthog } from "@/lib/posthog";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ffd6a5",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#c7f2a4",
  Cloud: "#a8d8ea",
  Music: "#f7b2bd",
  Other: "#d3d3d3",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("");

  const parsedPrice = parseFloat(price);
  const isValid =
    name.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0;

  const brandMatch = getBrandConfig(name);
  const previewIcon = brandMatch ? brandMatch.icon : icons.wallet;
  const previewColor = brandMatch ? brandMatch.color : "#d3d3d3";

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const now = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? now.add(1, "month").toISOString()
        : now.add(1, "year").toISOString();

    const selectedCategory = category || "Other";

    const subscription: Subscription = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      currency: "USD",
      frequency,
      billing: frequency,
      category: selectedCategory,
      status: "active",
      startDate: now.toISOString(),
      renewalDate,
      icon: previewIcon,
      color: brandMatch
        ? brandMatch.color
        : (CATEGORY_COLORS[selectedCategory] ?? "#d3d3d3"),
    };

    onSubmit(subscription);
    posthog?.capture("subscription_created", {
      name: name.trim(),
      price: parsedPrice,
      currency: "USD",
      frequency,
      category: selectedCategory,
      brand_matched: !!brandMatch,
    });
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="modal-overlay">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="modal-body">
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TextInput
                      className="auth-input"
                      style={{ flex: 1 }}
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. Netflix"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                    />
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: previewColor,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: name.trim().length > 0 ? 1 : 0.35,
                      }}
                    >
                      <Image
                        source={previewIcon}
                        style={{ width: 26, height: 26, tintColor: "white" }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    className="auth-input"
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    keyboardType="decimal-pad"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as const).map((opt) => (
                      <Pressable
                        key={opt}
                        className={clsx(
                          "picker-option",
                          frequency === opt && "picker-option-active",
                        )}
                        onPress={() => setFrequency(opt)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            frequency === opt && "picker-option-text-active",
                          )}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        className={clsx(
                          "category-chip",
                          category === cat && "category-chip-active",
                        )}
                        onPress={() => setCategory(cat)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            category === cat && "category-chip-text-active",
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Pressable
                  className={clsx(
                    "auth-button",
                    !isValid && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text className="auth-button-text">Add Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
