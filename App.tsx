/**
 * DetoxAppTesting — Auth Demo
 * Screens: Welcome → SignUp / Login → Home
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 'welcome' | 'signup' | 'login' | 'home';

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<Screen>('welcome');
  const [loggedInName, setLoggedInName] = useState('');

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView
        style={[styles.safeArea, {backgroundColor: colors.background}]}>
        {screen === 'welcome' && (
          <WelcomeScreen colors={colors} navigate={setScreen} />
        )}
        {screen === 'signup' && (
          <SignUpScreen
            colors={colors}
            navigate={setScreen}
            onSuccess={(name: string) => {
              setLoggedInName(name);
              setScreen('home');
            }}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            colors={colors}
            navigate={setScreen}
            onSuccess={(name: string) => {
              setLoggedInName(name);
              setScreen('home');
            }}
          />
        )}
        {screen === 'home' && (
          <HomeScreen
            colors={colors}
            name={loggedInName}
            onLogout={() => {
              setLoggedInName('');
              setScreen('welcome');
            }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function WelcomeScreen({
  colors,
  navigate,
}: {
  colors: ColorSet;
  navigate: (s: Screen) => void;
}) {
  return (
    <View testID="welcome_screen" style={styles.centerContainer}>
      <Text style={[styles.appTitle, {color: colors.primary}]}>
        DetoxAppTesting
      </Text>
      <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
        Your testing playground
      </Text>

      <TouchableOpacity
        testID="goto_signup_button"
        style={[styles.primaryButton, {backgroundColor: colors.primary}]}
        onPress={() => navigate('signup')}>
        <Text style={styles.primaryButtonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="goto_login_button"
        style={[styles.outlineButton, {borderColor: colors.primary}]}
        onPress={() => navigate('login')}>
        <Text style={[styles.outlineButtonText, {color: colors.primary}]}>
          Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Sign Up Screen ───────────────────────────────────────────────────────────
function SignUpScreen({
  colors,
  navigate,
  onSuccess,
}: {
  colors: ColorSet;
  navigate: (s: Screen) => void;
  onSuccess: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSignUp() {
    if (validate()) {
      onSuccess(name.trim());
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View testID="signup_screen" style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View>
            <Text style={[styles.screenTitle, {color: colors.text}]}>
              Create Account
          </Text>
          <Text style={[styles.screenSubtitle, {color: colors.textSecondary}]}>
            Sign up to get started
          </Text>

          {/* Name */}
          <Text style={[styles.label, {color: colors.text}]}>Full Name</Text>
          <TextInput
            testID="signup_name_input"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.name ? colors.error : colors.border,
              },
            ]}
            placeholder="Enter your full name"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.name && (
            <Text testID="signup_name_error" style={[styles.errorText, {color: colors.error}]}>
              {errors.name}
            </Text>
          )}

          {/* Email */}
          <Text style={[styles.label, {color: colors.text}]}>Email Address</Text>
          <TextInput
            testID="signup_email_input"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.email ? colors.error : colors.border,
              },
            ]}
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          {errors.email && (
            <Text testID="signup_email_error" style={[styles.errorText, {color: colors.error}]}>
              {errors.email}
            </Text>
          )}

          {/* Password */}
          <Text style={[styles.label, {color: colors.text}]}>Password</Text>
          <TextInput
            testID="signup_password_input"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.password ? colors.error : colors.border,
              },
            ]}
            placeholder="Create a password (min. 6 chars)"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && (
            <Text testID="signup_password_error" style={[styles.errorText, {color: colors.error}]}>
              {errors.password}
            </Text>
          )}

          <TouchableOpacity
            testID="signup_submit_button"
            style={[styles.primaryButton, {backgroundColor: colors.primary}]}
            onPress={handleSignUp}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={{color: colors.textSecondary}}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity testID="goto_login_link" onPress={() => navigate('login')}>
              <Text style={[styles.linkText, {color: colors.primary}]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({
  colors,
  navigate,
  onSuccess,
}: {
  colors: ColorSet;
  navigate: (s: Screen) => void;
  onSuccess: (name: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleLogin() {
    if (validate()) {
      // Derive display name from email prefix for demo purposes
      const displayName = email.split('@')[0];
      onSuccess(displayName);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View testID="login_screen" style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View>
            <Text style={[styles.screenTitle, {color: colors.text}]}>
              Welcome Back
          </Text>
          <Text style={[styles.screenSubtitle, {color: colors.textSecondary}]}>
            Log in to your account
          </Text>

          {/* Email */}
          <Text style={[styles.label, {color: colors.text}]}>Email Address</Text>
          <TextInput
            testID="login_email_input"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.email ? colors.error : colors.border,
              },
            ]}
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          {errors.email && (
            <Text testID="login_email_error" style={[styles.errorText, {color: colors.error}]}>
              {errors.email}
            </Text>
          )}

          {/* Password */}
          <Text style={[styles.label, {color: colors.text}]}>Password</Text>
          <TextInput
            testID="login_password_input"
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: errors.password ? colors.error : colors.border,
              },
            ]}
            placeholder="Enter your password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && (
            <Text testID="login_password_error" style={[styles.errorText, {color: colors.error}]}>
              {errors.password}
            </Text>
          )}

          <TouchableOpacity
            testID="login_submit_button"
            style={[styles.primaryButton, {backgroundColor: colors.primary}]}
            onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={{color: colors.textSecondary}}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity testID="goto_signup_link" onPress={() => navigate('signup')}>
              <Text style={[styles.linkText, {color: colors.primary}]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({
  colors,
  name,
  onLogout,
}: {
  colors: ColorSet;
  name: string;
  onLogout: () => void;
}) {
  return (
    <View testID="home_screen" style={styles.centerContainer}>
      <Text style={[styles.appTitle, {color: colors.primary}]}>🎉</Text>
      <Text testID="home_welcome_text" style={[styles.screenTitle, {color: colors.text}]}>
        Hello, {name}!
      </Text>
      <Text style={[styles.screenSubtitle, {color: colors.textSecondary}]}>
        You have successfully authenticated.
      </Text>

      <TouchableOpacity
        testID="logout_button"
        style={[styles.outlineButton, {borderColor: colors.error}]}
        onPress={onLogout}>
        <Text style={[styles.outlineButtonText, {color: colors.error}]}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Colors ───────────────────────────────────────────────────────────────────
type ColorSet = typeof lightColors;

const lightColors = {
  background: '#f5f7fa',
  primary: '#4361ee',
  text: '#1a1a2e',
  textSecondary: '#6b7280',
  inputBg: '#ffffff',
  border: '#d1d5db',
  placeholder: '#9ca3af',
  error: '#ef4444',
};

const darkColors: ColorSet = {
  background: '#0f172a',
  primary: '#6366f1',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  inputBg: '#1e293b',
  border: '#334155',
  placeholder: '#64748b',
  error: '#f87171',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: {flex: 1},
  safeArea: {flex: 1},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 32,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
