import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import EventSource from "react-native-sse";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the shape of recipe data
type RecipeData = {
  ingredients: string;
  mealType: string;
  cuisine: string;
  diet: string;
  cookingTime: string;
  complexity: string;
  numberOfServings: string;
  calories: string;
};

type RecipeCardProps = {
  onSubmit: (data: RecipeData) => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [cookingTime, setCookingTime] = useState("Less than 30 minutes");
  const [complexity, setComplexity] = useState("Beginner");
  const [numberOfServings, setNumberOfServings] = useState("");
  const [calories, setCalories] = useState("");
  const [showMealTypePicker, setShowMealTypePicker] = useState(false);
  const [showCookingTimePicker, setShowCookingTimePicker] = useState(false);
  const [showComplexityPicker, setShowComplexityPicker] = useState(false);

  const handleSubmit = () => {
    const recipeData: RecipeData = {
      ingredients,
      mealType,
      cuisine,
      diet,
      cookingTime,
      complexity,
      numberOfServings,
      calories,
    };
    onSubmit(recipeData);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Recipe Generator</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ingredients</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ingredients"
            value={ingredients}
            onChangeText={setIngredients}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Meal Type</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowMealTypePicker(true)}
          >
            <Text style={styles.pickerButtonText}>{mealType}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cuisine Preference</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChangeText={setCuisine}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Diet</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Vegetarian, Keto"
            value={diet}
            onChangeText={setDiet}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cooking Time</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCookingTimePicker(true)}
          >
            <Text style={styles.pickerButtonText}>{cookingTime}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Complexity</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowComplexityPicker(true)}
          >
            <Text style={styles.pickerButtonText}>{complexity}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Servings</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2, 4"
            value={numberOfServings}
            onChangeText={setNumberOfServings}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500, Under 800"
            value={calories}
            onChangeText={setCalories}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Generate Recipe</Text>
        </TouchableOpacity>

        {/* Meal Type Picker Modal */}
        <Modal
          transparent={true}
          visible={showMealTypePicker}
          animationType="slide"
          onRequestClose={() => setShowMealTypePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Meal Type</Text>
              <ScrollView>
                {["Breakfast", "Lunch", "Dinner", "Snack"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.modalItem,
                      mealType === item && styles.selectedItem,
                    ]}
                    onPress={() => {
                      setMealType(item);
                      setShowMealTypePicker(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMealTypePicker(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Cooking Time Picker Modal */}
        <Modal
          transparent={true}
          visible={showCookingTimePicker}
          animationType="slide"
          onRequestClose={() => setShowCookingTimePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Cooking Time</Text>
              <ScrollView>
                {[
                  "Less than 30 minutes",
                  "30-60 minutes",
                  "More than 1 hour",
                ].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.modalItem,
                      cookingTime === item && styles.selectedItem,
                    ]}
                    onPress={() => {
                      setCookingTime(item);
                      setShowCookingTimePicker(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCookingTimePicker(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Complexity Picker Modal */}
        <Modal
          transparent={true}
          visible={showComplexityPicker}
          animationType="slide"
          onRequestClose={() => setShowComplexityPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Complexity</Text>
              <ScrollView>
                {["Beginner", "Intermediate", "Advanced"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.modalItem,
                      complexity === item && styles.selectedItem,
                    ]}
                    onPress={() => {
                      setComplexity(item);
                      setShowComplexityPicker(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowComplexityPicker(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const Index = () => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [recipeText, setRecipeText] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    closeEventStream();
    return () => closeEventStream();
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream();
      initializeEventStream(recipeData);
    }
  }, [recipeData]);

  const initializeEventStream = (data: RecipeData) => {
    const queryParams = new URLSearchParams(data as any).toString();
    const url = `http://172.22.6.2:3001/recipeStream?${queryParams}`;

    const source = new EventSource(url);
    eventSourceRef.current = source;

    source.addEventListener("message", (event: { data: string | null }) => {
      if (!event.data) return;

      const data = JSON.parse(event.data);
      console.log(data);

      if (data.action === "close") {
        closeEventStream();
      } else if (data.action === "chunk") {
        setRecipeText((prev) => prev + data.chunk);
      }
    });

    source.addEventListener("error", () => {
      closeEventStream();
    });
  };

  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const onSubmit = (data: RecipeData) => {
    setRecipeText("");
    setRecipeData(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <RecipeCard onSubmit={onSubmit} />
          {recipeText ? (
            <View style={styles.recipeOutput}>
              <ScrollView style={styles.recipeScroll}>
                <Text style={styles.recipeText}>{recipeText}</Text>
              </ScrollView>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// (your styles unchanged below...)

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 24,
    width: "100%",
  },
  cardContainer: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#4a4a4a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "white",
  },
  picker: {
    height: 40,
    width: "100%",
    color: "#000",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  recipeOutput: {
    width: "100%",
    maxWidth: 400,
    height: 400,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeScroll: {
    flex: 1,
  },
  recipeText: {
    fontSize: 14,
    color: "#666",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "white",
  },
  pickerButtonText: {
    color: "#000",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#e6f7ff",
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
