import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Image
} from "react-native";
import React, { useRef } from "react";
import FormHeader from "../components/FormHeader";
import AuthSelectorButton from "../components/AuthSelectorButton";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthForm = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();

  const rhOpacity = animation.interpolate({
    inputRange: [0, width],
    outputRange: [1, 0],
  });

  const lhTranslateX = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, 40],
  });

  const rhTranslateY = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, -20],
  });

  const loginColorInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ["rgba(47, 79, 79, 1)", "rgba(79, 131, 131, 0.6)"],
  });

  const signupColorInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ["rgba(79, 131, 131, 0.6)", "rgba(47, 79, 79, 1)"],
  });

  return (
    
<View style={{ flex: 1, paddingTop: 60 }}>
      {/* Logo Image at the top */}
      <View style={styles.logoContainer}>
        <Image 
          source={require("../../assets/l.png")}  // Path to your logo
          style={styles.logo}
          resizeMode="contain"  // Ensures the logo is contained within the given size
        />
      </View>
    

      <View style={{ height: 80 }}>
        <FormHeader
          leftHeading="Welcome"
          rightHeading="Back"
          subHeading="MDCAT.ai"
          rhOpacity={rhOpacity}
          lhTranslateX={lhTranslateX}
          rhTranslateY={rhTranslateY}
        />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <AuthSelectorButton
          title="Log In"
          style={styles.borderLeft}
          backgroundColor={loginColorInterpolate}
          onPress={() => scrollView.current.scrollTo({ x: 0 })}
        />
        <AuthSelectorButton
          title="Sign Up"
          style={styles.borderRight}
          backgroundColor={signupColorInterpolate}
          onPress={() => scrollView.current.scrollTo({ x: width })}
        />
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: animation } } }],
          { useNativeDriver: false }
        )}
        ref={scrollView}
      >
        <LoginForm navigation={navigation} />
        <ScrollView>
          <SignupForm navigation={navigation} />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 90,  
    height: 90,  
    margin:"auto",
    marginBottom:10,
    marginTop:-2
  },
  borderLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  borderRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default AuthForm;
