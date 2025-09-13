import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { authStyles } from '../../assets/styles/auth.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import VerifyEmail from './verify-email'

const SignUpScreen = () => {

    const router = useRouter()
    const { isLoading, signUp } = useSignUp()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)

    const handleSignUp = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Email or password is empty")
        }

        if (isLoading) return

        setLoading(true)

        try {
            console.log("signup here 1")
            await signUp.create({ emailAddress: email, password: password })
            console.log("signup here 2")
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
            console.log("signup here 3")

            setPendingVerification(true)
        } catch (error) {
            console.log("signup here 4")
            //console.error('ok google error:', error)
            Alert.alert("Error", error.errors?.[0].message || "Exception while signing in")
        } finally {
            setLoading(false)
        }
    }

    if (pendingVerification) return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />


    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                style={authStyles.keyboardView}
                behavior={Platform === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i2.png")}
                            style={authStyles.image}
                            contentFit='contain'
                        />
                    </View>

                    <Text style={authStyles.title}>
                        Create Account
                    </Text>

                    <View style={authStyles.formContainer}>

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
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>
                                {loading ? "Signing Up..." : "Sign Up"}
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.back()}>

                            <Text style={authStyles.linkText}>
                                Already have an accout? <Text style={authStyles.link}>
                                    Sign in
                                </Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignUpScreen