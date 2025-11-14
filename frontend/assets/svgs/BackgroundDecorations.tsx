import * as React from "react"
import { View } from "react-native"
import Svg, { SvgProps, Path, Circle } from "react-native-svg"

const BackgroundDecorations = ({
  style, ...props
}: SvgProps) => (
  <View style={[{ aspectRatio: 402/437 }, style]} >
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 402 437"
      fill="none"
      { ...props }
    >
      <Path fill="#DCBEA7" d="M0 226h186v211H0z" />
      <Circle cx={255} cy={368} r={69} fill="#D39A72" />
      <Path
        fill="#F1EBB3"
        d="m401.979 138.117-31.786 232.247L184.828 226.4l217.151-88.283Z"
      />
      <Circle cx={113} cy={113} r={113} fill="#B1BEA1" />
    </Svg>
  </View>
)

export default BackgroundDecorations
