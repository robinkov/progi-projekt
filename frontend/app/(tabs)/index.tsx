import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { TextButton } from "@/components/Button";
import { useAuth } from "@/hooks/use-auth";
import ThemedText from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/Input";
import { useState } from "react";
import endpoints from "@/constants/endpoints";
import { set } from "zod";
import theme from "@/utils/theme";

export default function index() {
  const auth = useAuth();

  const [firstName, setFirstName] = useState<string>(auth.user?.firstName || "");
  const [lastName, setLastName] = useState<string>(auth.user?.lastName || "");
  const [displayName, setDisplayName] = useState<string>(auth.user?.displayName || "");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSaveChanges() {
    setLoading(true);
    try {
      await fetch(endpoints.UPDATE_USER, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${auth.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "first_name": firstName,
          "last_name": lastName,
          "username": displayName
        })
      });
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        gap: 10
      }}>
        <ThemedTextInput
          textContentType="emailAddress"
          placeholder="Email"
          value={auth.user?.email || ""}
          editable={false}
        />
        <ThemedTextInput
          textContentType="givenName"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <ThemedTextInput
          textContentType="familyName"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <ThemedTextInput
          textContentType="nickname"
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        { error &&
          <ThemedText style={{ textAlign: "center", color: theme.colors.destructive.DEFAULT }}>
            { error }
          </ThemedText>
        }
        <TextButton onPress={handleSaveChanges} style={{
          width: 200
        }}>
          Save changes
        </TextButton>
        <TextButton onPress={auth.userLogout} style={{
          width: 200
        }}>
          Logout
        </TextButton>
      </View>
    </SafeAreaView>
  );
}
