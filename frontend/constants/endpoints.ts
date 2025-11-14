const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL

export default {
  PROFILE: `${backendUrl}/api/profile`,
  GET_USER: `${backendUrl}/getuser`,
  UPDATE_USER: `${backendUrl}/saveprofile`,
}
