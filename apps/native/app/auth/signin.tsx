import { login } from '@react-native-kakao/user';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, Platform, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/ui/text-input';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const { styles } = useStyles(stylesheet);
  const { setUser } = useUserStore();

  async function signInWithEmail() {
    setLoading(true);
    const {
      data: { user },
      error,
    } = await supabase.signInWithEmail({ email, password });

    if (error) Alert.alert(error.message);
    if (user) setUser(user);

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session, user },
      error,
    } = await supabase.signUpWithEmail({
      email: email,
      password: password,
      options: {
        data: { nickname },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    if (user) setUser(user);
    setLoading(false);
    router.dismiss();
  }

  async function signInWithKakao() {
    const result = await login();
    const {
      data: { user },
      error,
    } = await supabase.signInWithIdToken({
      provider: 'kakao',
      token: result.idToken!, // OpenID Connect 활성화 필요
      access_token: result.accessToken,
    });
    if (!error) {
      if (user) setUser(user);
      router.dismiss();
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Button title="Go back" onPress={() => router.dismiss()} />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={text => setNickname(text)}
          value={nickname}
          placeholder="Nickname"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign in with kakao" disabled={loading} onPress={signInWithKakao} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
    backgroundColor: theme.colors.background,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
}));
