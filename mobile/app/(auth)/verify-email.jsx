import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

const VerifyEmail = ({ email, onBack }) => {

    const { isLoaded, signUp, setActive } = useSignUp()

    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)

    const handleVerfication = async () => {
        if (loading) return

        setLoading(true)
        try {
            const emailVerifyResult = await signUp.attemptEmailAddressVerification({ code })

            if (emailVerifyResult.status === "complete") {
                await setActive({ session: emailVerifyResult.createdSessionId })
                Alert.alert("Success", "Verification failed")
            } else {
                Alert.alert("Error", "Verification failed")
            }
        } catch (error) {
            console.log("Here is the error", error)
            Alert.alert("Error", "Catch")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={authStyles.keyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Container */}
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i3.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>

                    {/* Title */}
                    <Text style={authStyles.title}>Verify Your Email</Text>
                    <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

                    <View style={authStyles.formContainer}>
                        {/* Verification Code Input */}
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter verification code"
                                placeholderTextColor={COLORS.textLight}
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                            onPress={handleVerfication}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
                        </TouchableOpacity>

                        {/* Back to Sign Up */}
                        <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                            <Text style={authStyles.linkText}>
                                <Text style={authStyles.link}>Back to Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}


export default VerifyEmail