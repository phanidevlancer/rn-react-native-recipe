import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import { useState } from 'react'

import { Image } from 'expo-image'

import { authStyles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'

import { Ionicons } from "@expo/vector-icons"

const SignInScreen = () => {

    const router = useRouter()
    const { signIn, setActive, isLoaded } = useSignIn()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    const handleSignIn = async () => {

        if (loading) return

        if (!email || !password) {
            Alert.alert("Error", "Email or password is empty")
            return
        }

        setLoading(true)
        await delay(2000)
        try {
            const signInResult = await signIn.create({
                identifier: email,
                password: password
            })

            if (signInResult === "complete") {
                await setActive({ session: signInResult.createdSessionId })
            } else {
                Alert.alert("Error", "SignIn Failed, Please try again later!")
                console.log("error is : ", signInResult)
            }
        } catch (error) {
            console.error('ok google error:', error)
            Alert.alert("Error", error.errors?.[0].message || "Exception while signing in")

        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                style={authStyles.keyboardView}
                behavior={Platform === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform === "ios" ? 64 : 0}>
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i1.png")}
                            style={authStyles.image}
                            contentFit='contain'
                        />
                    </View>
                    <Text style={authStyles.title}>
                        Welcome Back!
                    </Text>

                    {/*FORM CONTAINER */}
                    <View style={authStyles.formContainer}>
                        {/*EMAIL Input */}
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter Email'
                                placeholderTextColor={COLORS.textLight}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>

                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Password'
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize='none'
                            />
                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textLight}
                                />

                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                            onPress={handleSignIn}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {loading ? "Signing In..." : "Sign In"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.push("/(auth)/sign-up")}>

                            <Text style={authStyles.linkText}>
                                Don&apos;t have an accout? <Text style={authStyles.link}>
                                Sign up
                            </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignInScreen