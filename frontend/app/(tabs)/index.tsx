import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { TextButton } from "@/components/Button";
import { useAuth } from "@/hooks/use-auth";

export default function index() {
  const auth = useAuth();
  return (
    <SafeAreaView>
      <TextButton onPress={auth.userLogout}>Logout</TextButton>
    </SafeAreaView>
  );
}
