/*
  Smart IoT Dashboard - ESP32 Dustbin Sensor Code
  
  This code reads sensor data from an ultrasonic sensor and sends it to the backend API.
  
  Hardware Required:
  - ESP32 Development Board
  - HC-SR04 Ultrasonic Sensor
  - USB Cable for programming
  
  Connections:
  - HC-SR04 VCC -> ESP32 5V
  - HC-SR04 GND -> ESP32 GND
  - HC-SR04 TRIG -> ESP32 GPIO 5
  - HC-SR04 ECHO -> ESP32 GPIO 18
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// API Configuration
const char* apiUrl = "http://your-api.com/api/dustbin/device/log";
const char* userId = "your-user-uuid";
const char* apiKey = "your-iot-api-key";

// Sensor pins
const int trigPin = 5;
const int echoPin = 18;

// Dustbin configuration
const float maxDistance = 20.0; // Maximum distance in cm (empty)
const float minDistance = 5.0;  // Minimum distance in cm (full)

// Timing
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 60000; // Send data every 60 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize sensor pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Connect to WiFi
  connectToWiFi();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  
  // Send data at intervals
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    
    // Read sensor
    float distance = measureDistance();
    String status = getStatus(distance);
    int level = getLevel(distance);
    
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.print(" cm, Status: ");
    Serial.print(status);
    Serial.print(", Level: ");
    Serial.println(level);
    
    // Send to API
    sendToAPI(status, level);
  }
}

// Connect to WiFi
void connectToWiFi() {
  Serial.println("\nConnecting to WiFi...");
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }
}

// Measure distance using ultrasonic sensor
float measureDistance() {
  // Send pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Measure pulse duration
  long duration = pulseIn(echoPin, HIGH, 30000);
  
  // Calculate distance (speed of sound = 343 m/s)
  float distance = (duration * 0.0343) / 2;
  
  return distance;
}

// Get status based on distance
String getStatus(float distance) {
  if (distance <= minDistance) {
    return "full";
  } else if (distance >= maxDistance) {
    return "empty";
  } else {
    return "partial";
  }
}

// Get fill level (0-100%)
int getLevel(float distance) {
  if (distance <= minDistance) {
    return 100;
  } else if (distance >= maxDistance) {
    return 0;
  } else {
    // Linear interpolation
    int level = 100 - ((distance - minDistance) / (maxDistance - minDistance)) * 100;
    return constrain(level, 0, 100);
  }
}

// Send data to API
void sendToAPI(String status, int level) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }
  
  HTTPClient http;
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["userId"] = userId;
  doc["status"] = status;
  doc["level"] = level;
  doc["apiKey"] = apiKey;
  
  String payload;
  serializeJson(doc, payload);
  
  // Send POST request
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payload);
  
  if (httpCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpCode);
    
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpCode);
  }
  
  http.end();
}

/*
  SETUP INSTRUCTIONS:
  
  1. Install required libraries:
     - ArduinoJson (by Benoit Blanchon)
     - ESP32 board support
  
  2. Update WiFi credentials:
     - Replace YOUR_SSID with your WiFi network name
     - Replace YOUR_PASSWORD with your WiFi password
  
  3. Update API configuration:
     - Replace your-api.com with your backend URL
     - Replace your-user-uuid with your Supabase user ID
     - Replace your-iot-api-key with your IoT API key
  
  4. Adjust sensor configuration:
     - maxDistance: Distance when bin is empty (cm)
     - minDistance: Distance when bin is full (cm)
  
  5. Upload to ESP32:
     - Select Tools > Board > ESP32 Dev Module
     - Select correct COM port
     - Click Upload
  
  6. Monitor serial output:
     - Open Serial Monitor (115200 baud)
     - Check sensor readings and API responses
*/
