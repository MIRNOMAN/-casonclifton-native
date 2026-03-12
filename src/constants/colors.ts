/**
 * Color tokens — values mirror the CSS custom properties defined in
 * src/styles/global.css (@theme block).
 * Crestcon dark theme.
 */
export const COLORS = {
  /** Page background – very dark navy */
  background: '#0D1117',
  /** Card / input surface */
  surface: '#161D2E',
  /** Pressed / hover surface */
  surface2: '#1E2740',
  /** Input border */
  border: '#2A3448',
  /** Primary text – white */
  textPrimary: '#FFFFFF',
  /** Muted / placeholder text */
  textSecondary: '#9CA3AF',
  /** Red accent – links, errors */
  accent: '#EF4444',
  /** Login button background */
  btn: '#FFFFFF',
  /** Login button label */
  btnText: '#0D1117',
  /** Alias kept for legacy usage */
  onboardingAccent: '#EF4444',
} as const;
