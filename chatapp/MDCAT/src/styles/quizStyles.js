import { StyleSheet } from "react-native";

export default StyleSheet.create({
    iconContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 18,
      marginTop: 10,
      color: "#4F8383",
      fontFamily: "Nunito_400Regular",
    },
  
    scrollView: {
      flex: 1,
    },
  
    selectedOptionText: {
      color: "black",
      fontFamily: "Nunito_400Regular",
    },
  
    setupContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
  
    // Header Section
    instructionHeader: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    instructionTitle: {
      fontSize: 22,
      fontFamily: "Nunito_600SemiBold",
      color: "#34495e",
      marginTop: 10,
    },
  
    // Instructions Section
    instructions: { marginBottom: 20 },
    instructionText: {
      fontSize: 18,
      color: "#2c3e50",
      lineHeight: 24,
      marginBottom: 10,
      fontFamily: "Nunito_600SemiBold",
    },
  
    // Selection Section
    selectionSection: { marginBottom: 20 },
    selectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#34495e",
      marginBottom: 10,
      fontFamily: "Nunito_600SemiBold",
    },
    setupOptions: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    setupOption: {
      backgroundColor: "#e6eef3",
      borderRadius: 8,
      padding: 10,
      width: 60,
      alignItems: "center",
    },
    selectedOption: {
      backgroundColor: "#4CAF50",
    },
    optionText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#2c3e50",
      fontFamily: "Nunito_600SemiBold",
    },
    setupScrollView: {
      flex: 1,
      backgroundColor: "#fff",
    },
    setupScrollViewContent: {
      flexGrow: 1,
    },
  
    // Start Button
    startButton: {
      backgroundColor: "#4F8383",
      borderRadius: 8,
      padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    startButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
      fontFamily: "Nunito_600SemiBold",
    },
  
    setupText: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#2c3e50",
      fontFamily: "Nunito_600SemiBold",
    },
    setupOptions: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
    },
    setupOption: {
      backgroundColor: "#ecf0f1",
      padding: 10,
      marginHorizontal: 10,
      borderRadius: 10,
    },
    timerContainer: {
      marginTop: 20,
    },
    timerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#2F4F4F",
      fontFamily: "Nunito_600SemiBold",
    },
  
    quiz: {
      flex: 1,
      backgroundColor: "#fef9f3",
    },
  
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#ffffff",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // marginBottom:10,
        elevation:3
      },
      topicTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        fontFamily: "Nunito_400Regular",
      },
    container: {
      flex: 1,
      paddingTop: 0,
      paddingBottom:40,
      paddingHorizontal: 20,
      backgroundColor: "transparent",
    },
    questionBox: {
      backgroundColor: "#ecf0f1",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginTop: "30%",
      marginBottom:25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
    },
    progressCircleContainer: {
      position: "absolute",
      top: -45,
      alignItems: "center",
      justifyContent: "center",
      width: 60,
      height: 60,
    },
    progressText: {
      position: "absolute",
      fontSize: 24,
      fontWeight: "bold",
      color: "#2F4F4F",
      fontFamily: "Nunito_600SemiBold",
    },
    questionDescription: {
      color: "#34495e",
      fontSize: 18,
      textAlign: "left",
      fontWeight: "400",
      marginTop: 10,
      zIndex: 10,
      fontFamily: "Nunito_600SemiBold",
    },
    optionsContainer: {
        marginVertical: 25,
        flexGrow: 1,
    },
    optionsContentContainer: {
      paddingBottom: 0,
    },
  
    optionText: {
      fontSize: 16,
      color: "#2F4F4F",
      fontFamily: "Nunito_400Regular",
    },
    selectedOption: {
      backgroundColor: "#A1C6C6",
      color: "white",
    },
  
    optionItem: {
      padding: 15,
      marginBottom: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
    },
  
    nextButton: {
      backgroundColor: "#4F8383",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginVertical:10
    },
  
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Nunito_600SemiBold",
    },

    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    scoreModal: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 20,
      alignItems: "center",
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      fontFamily: "Nunito_600SemiBold",
    },
    modalScore: {
      fontSize: 16,
      marginBottom: 20,
      fontFamily: "Nunito_400Regular",
    },
    resultButton: {
      backgroundColor: "#2F4F4F",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginTop: 10,
    },
    difficultyText: {
      fontSize: 16,
      fontWeight: "bold",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginTop: 10,
      textAlign: "center",
      fontFamily: "Nunito_600SemiBold",
    },
    easy: {
      backgroundColor: "#E8F5E9",
      color: "#2E7D32",
    },
    medium: {
      backgroundColor: "#FFF3E0",
      color: "#E65100",
    },
    hard: {
      backgroundColor: "#FFEBEE",
      color: "#C62828",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
      },
      errorMessage: {
        fontSize: 16,
        color: "#e74c3c",
        textAlign: "center",
        marginBottom: 20,
      },
      retryButton: {
        backgroundColor: "#4F8383",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
      },
      retryButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
      },
  });
  
  
