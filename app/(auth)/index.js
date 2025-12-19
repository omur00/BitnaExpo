import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LOGIN_USER } from '@/utils/queries';
import { useAuth } from '@/context/auth-context';
import { hasAnyPermission, PERMISSION_GROUPS } from '@/utils/permissions';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client/react';

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'hezam30@gmail.com',
    password: 'Hezammateralshraikah1977/#',
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      setLoading(false);
      if (data?.loginUser?.user) {
        login(data.loginUser.user);

        // Check permissions and redirect
        if (
          data.loginUser.user.role === 'admin' ||
          hasAnyPermission(data.loginUser.user, PERMISSION_GROUPS.ALL)
        ) {
          router.push('/(admin)');
        } else {
          router.push('/(auth)/dashboard');
        }
      }
    },
    onError: (error) => {
      setLoading(false);
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء تسجيل الدخول');
    },
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await loginUser({
        variables: {
          input: formData,
        },
      });
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>تسجيل الدخول</Text>
            <Text style={styles.subtitle}>ادخل إلى حسابك</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>البريد الإلكتروني *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#4E6882" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textAlign="right"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>كلمة المرور *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#4E6882"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="أدخل كلمة المرور"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry
                  textAlign="right"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>تسجيل الدخول</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity
                onPress={() => router.push('/(stacks)/register')}
                style={styles.linkButton}>
                <Text style={styles.linkText}>
                  <Text style={styles.regularText}>لا تملك حساب؟ </Text>
                  <Text style={styles.boldLink}>أنشئ حساب جديد</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgotPassword')}
                style={styles.linkButton}>
                <Text style={styles.linkText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#18344A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2053',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#4E6882',
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18344A',
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD0D6',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#18344A',
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    textAlign: 'right',
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  button: {
    backgroundColor: '#1E2053',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  linkButton: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    textAlign: 'center',
  },
  regularText: {
    color: '#4E6882',
  },
  boldLink: {
    color: '#1E2053',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
  },
});
