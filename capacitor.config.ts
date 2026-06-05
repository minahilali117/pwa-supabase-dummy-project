import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.lunchpicker.app',
  appName: 'Lunch Picker',
  webDir: 'out',
  server: {
    url: 'https://lunch-picker-pi.vercel.app',
    cleartext: true,
  },
}

export default config