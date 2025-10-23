import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-background"
    >
      <Text className="text-3xl font-semibold text-foreground">
        ClayPlay
      </Text>
    </SafeAreaView>
  );
}
