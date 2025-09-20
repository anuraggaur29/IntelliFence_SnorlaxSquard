# IntelliFence Technical Specifications
## Electric Fence Monitoring Hardware System

### Problem Statement Analysis

**Problem ID:** 25077  
**Challenge:** Design hardware to detect and prevent unauthorized use of electric fences  
**Target:** Kerala State Electricity Board Limited (KSEBL)

### Technical Requirements

#### 1. Detection Capabilities
- **Current Monitoring:** Real-time measurement of electrical current flow
- **Voltage Monitoring:** Continuous voltage level assessment
- **Power Quality Analysis:** THD, power factor, frequency monitoring
- **Load Pattern Recognition:** AI-based usage pattern analysis
- **Tamper Detection:** Physical interference identification

#### 2. Prevention Mechanisms
- **Automatic Disconnection:** Remote circuit breaker control
- **Alert Systems:** Multi-channel notification system
- **Access Control:** Biometric/RFID-based authorization
- **Audit Trail:** Comprehensive logging system
- **Forensic Analysis:** Event reconstruction capabilities

### Hardware Architecture

#### Core Processing Unit
```
Microcontroller: ESP32-WROOM-32E
- Processor: Dual-core Tensilica LX6 @ 240MHz
- Memory: 520KB SRAM, 4MB Flash
- Connectivity: WiFi 802.11 b/g/n, Bluetooth 4.2
- GPIO: 34 programmable pins
- ADC: 18 channels, 12-bit resolution
- Operating Voltage: 3.3V
- Power Consumption: 80mA active, 10µA deep sleep
```

#### Sensing Systems

##### Current Measurement
```
Primary: SCT-013-030 Non-invasive CT Sensor
- Range: 0-30A AC
- Accuracy: ±1%
- Output: 0-1V AC
- Isolation: 3000V
- Response Time: <100ms

Secondary: ACS712-30A Hall Effect Sensor
- Range: -30A to +30A
- Sensitivity: 66mV/A
- Accuracy: ±1.5%
- Bandwidth: 80kHz
- Temperature Stability: 100ppm/°C
```

##### Voltage Measurement
```
High Voltage Input: ZMPT101B Voltage Transformer
- Input Range: 0-250V AC
- Output: 0-5V AC
- Accuracy: ±1%
- Isolation: 2500V
- Frequency: 50Hz/60Hz

Low Voltage Processing: Precision Voltage Divider
- Ratio: 10:1
- Tolerance: ±0.1%
- Temperature Coefficient: ±25ppm/°C
- Input Protection: TVS diodes
```

##### Tamper Detection
```
Accelerometer: MPU6050
- Range: ±2g to ±16g (configurable)
- Sensitivity: 16384 LSB/g
- Temperature Range: -40°C to +85°C
- Interface: I2C
- Power: 3.9mA operating

Magnetic Sensor: HC-SR04 Ultrasonic + Reed Switch
- Detection Range: 2cm to 400cm
- Accuracy: 3mm
- Operating Frequency: 40kHz
- Operating Current: 15mA
```

#### Communication Systems

##### Primary Communication: GSM/4G
```
Module: SIM7600G-H
- Network: 4G LTE Cat-4
- Fallback: 3G WCDMA, 2G GSM
- Data Speed: 150Mbps DL, 50Mbps UL
- Voice: VoLTE support
- SMS: Full SMS support
- GPS: Built-in GNSS
- Power: 12V, 2A peak
- Temperature: -30°C to +75°C
```

##### Secondary Communication: WiFi
```
Built-in ESP32 WiFi
- Standard: IEEE 802.11 b/g/n
- Frequency: 2.4GHz
- Range: Up to 100m (open field)
- Security: WPA/WPA2/WPA3
- Antenna: PCB antenna + external option
```

##### Backup Communication: LoRa
```
Module: SX1276/RFM95W
- Frequency: 865-867MHz (India)
- Range: Up to 10km (LoS)
- Data Rate: 0.3-50 kbps
- Sensitivity: -148dBm
- Power Output: +20dBm
- Protocol: LoRaWAN 1.0.3
```

#### Power Management System

##### Solar Power System
```
Solar Panel: 20W Monocrystalline
- Voltage: 18V nominal
- Current: 1.1A maximum
- Efficiency: >20%
- Size: 350mm x 300mm x 17mm
- Weight: 1.8kg
- Weather Resistance: IP65

Charge Controller: MPPT CN3791
- Input: 6-40V
- Output: 12V regulated
- Efficiency: >95%
- Protection: Over-voltage, under-voltage, reverse polarity
- Temperature Compensation: -3mV/°C/cell
```

##### Battery System
```
Primary Battery: 12V 7Ah LiFePO4
- Chemistry: Lithium Iron Phosphate
- Nominal Voltage: 12.8V
- Capacity: 7Ah (89.6Wh)
- Cycle Life: >2000 cycles
- Operating Temperature: -20°C to +60°C
- Self-discharge: <3% per month
- Built-in BMS: Over-charge, over-discharge, short-circuit protection

Backup Battery: 18650 Li-ion for RTC
- Capacity: 2600mAh
- Voltage: 3.7V
- Purpose: Real-time clock and essential functions
- Backup Duration: 30 days
```

### Software Architecture

#### Firmware (Arduino Framework)
```cpp
Core Functions:
├── main.cpp                 // Main application loop
├── sensors/
│   ├── current_sensor.cpp   // Current measurement
│   ├── voltage_sensor.cpp   // Voltage measurement
│   ├── tamper_detect.cpp    // Tamper detection
│   └── power_monitor.cpp    // Power quality analysis
├── communication/
│   ├── gsm_handler.cpp      // GSM communication
│   ├── wifi_handler.cpp     // WiFi communication
│   ├── lora_handler.cpp     // LoRa communication
│   └── mqtt_client.cpp      // MQTT protocol
├── security/
│   ├── encryption.cpp       // AES encryption
│   ├── authentication.cpp   // Device authentication
│   └── secure_boot.cpp      // Secure boot loader
├── power/
│   ├── sleep_manager.cpp    // Power management
│   ├── battery_monitor.cpp  // Battery monitoring
│   └── solar_optimizer.cpp  // Solar power optimization
└── utils/
    ├── rtc_manager.cpp      // Real-time clock
    ├── flash_storage.cpp    // Local data storage
    └── watchdog.cpp         // System watchdog
```

#### Cloud Platform (Node.js/Express)
```javascript
Backend Services:
├── api/
│   ├── devices.js           // Device management
│   ├── sensors.js           // Sensor data handling
│   ├── alerts.js            // Alert management
│   ├── users.js             // User management
│   └── reports.js           // Report generation
├── services/
│   ├── mqtt_broker.js       // MQTT message broker
│   ├── data_processor.js    // Real-time data processing
│   ├── ml_engine.js         // Machine learning algorithms
│   ├── notification.js      // Multi-channel notifications
│   └── analytics.js         // Data analytics engine
├── database/
│   ├── models/              // MongoDB schemas
│   ├── migrations/          // Database migrations
│   └── seeders/             // Initial data
└── middleware/
    ├── auth.js              // Authentication middleware
    ├── validation.js        // Input validation
    ├── rate_limit.js        // Rate limiting
    └── error_handler.js     // Error handling
```

### Detection Algorithms

#### Unauthorized Usage Detection
```python
# Current Anomaly Detection
def detect_current_anomaly(current_data):
    # Statistical analysis
    mean_current = np.mean(current_data)
    std_current = np.std(current_data)
    threshold = mean_current + 3 * std_current
    
    # Machine learning approach
    model = IsolationForest(contamination=0.1)
    anomalies = model.fit_predict(current_data.reshape(-1, 1))
    
    return anomalies

# Power Pattern Recognition
def analyze_power_pattern(power_data, timestamp_data):
    # Time-series analysis
    ts = pd.Series(power_data, index=timestamp_data)
    
    # Seasonal decomposition
    decomposition = seasonal_decompose(ts, period=24)  # Daily pattern
    
    # Detect unusual patterns
    residuals = decomposition.resid
    anomalies = residuals > 2 * residuals.std()
    
    return anomalies

# Load Balancing Analysis
def detect_load_imbalance(phase_currents):
    # Three-phase current analysis
    phase_a, phase_b, phase_c = phase_currents
    
    # Calculate imbalance
    avg_current = (phase_a + phase_b + phase_c) / 3
    max_deviation = max(abs(phase_a - avg_current),
                       abs(phase_b - avg_current),
                       abs(phase_c - avg_current))
    
    imbalance_percent = (max_deviation / avg_current) * 100
    
    return imbalance_percent > 10  # 10% threshold
```

#### Tamper Detection Algorithms
```cpp
// Vibration-based tamper detection
bool detectVibrationTamper() {
    float accel_x, accel_y, accel_z;
    mpu.getAcceleration(&accel_x, &accel_y, &accel_z);
    
    // Calculate magnitude
    float magnitude = sqrt(accel_x*accel_x + accel_y*accel_y + accel_z*accel_z);
    
    // Apply moving average filter
    static float magnitude_buffer[10];
    static int buffer_index = 0;
    magnitude_buffer[buffer_index] = magnitude;
    buffer_index = (buffer_index + 1) % 10;
    
    float avg_magnitude = 0;
    for(int i = 0; i < 10; i++) {
        avg_magnitude += magnitude_buffer[i];
    }
    avg_magnitude /= 10;
    
    // Detect sudden changes
    float deviation = abs(magnitude - avg_magnitude);
    return deviation > VIBRATION_THRESHOLD;
}

// Magnetic field tamper detection
bool detectMagneticTamper() {
    int magnetic_reading = digitalRead(MAGNETIC_SENSOR_PIN);
    static int previous_reading = HIGH;
    
    // Detect state change
    if(magnetic_reading != previous_reading) {
        previous_reading = magnetic_reading;
        return true;  // Enclosure opened
    }
    
    return false;
}
```

### Communication Protocols

#### MQTT Message Format
```json
{
  "device_id": "EG_001_KL07",
  "timestamp": "2024-09-10T10:30:00Z",
  "location": {
    "latitude": 10.8505,
    "longitude": 76.2711
  },
  "sensor_data": {
    "current": {
      "phase_a": 15.2,
      "phase_b": 14.8,
      "phase_c": 15.5,
      "unit": "amperes"
    },
    "voltage": {
      "phase_a": 230.5,
      "phase_b": 229.8,
      "phase_c": 231.2,
      "unit": "volts"
    },
    "power": {
      "active": 3.5,
      "reactive": 0.8,
      "apparent": 3.6,
      "power_factor": 0.97,
      "unit": "kW"
    },
    "frequency": 50.1,
    "thd": 2.3
  },
  "tamper_status": {
    "vibration": false,
    "magnetic": false,
    "enclosure": "secure",
    "last_tamper": null
  },
  "system_status": {
    "battery_voltage": 12.6,
    "solar_voltage": 18.2,
    "temperature": 35.2,
    "signal_strength": -65,
    "memory_usage": 78
  },
  "alerts": [
    {
      "type": "current_anomaly",
      "severity": "medium",
      "message": "Current spike detected on Phase A",
      "timestamp": "2024-09-10T10:29:45Z"
    }
  ]
}
```

#### SMS Alert Format
```
[INTELLIFENCE ALERT]
Device: EG_001_KL07
Location: Palakkad District
Alert: UNAUTHORIZED ACCESS DETECTED
Current: 25.6A (Expected: 15.2A)
Time: 10:30 AM, 10-Sep-2024
Action Required: Immediate Investigation
Dashboard: https://dashboard.intellifence.in
```

### Security Implementation

#### Device Authentication
```cpp
// Device certificate-based authentication
bool authenticateDevice() {
    // Load device certificate from secure storage
    String device_cert = loadCertificate();
    
    // Generate challenge-response
    String challenge = generateChallenge();
    String response = signChallenge(challenge, device_cert);
    
    // Send to server for verification
    return verifyWithServer(challenge, response);
}

// Secure communication setup
void setupSecureComm() {
    // Initialize TLS
    WiFiClientSecure client;
    client.setCACert(ca_cert);
    client.setCertificate(client_cert);
    client.setPrivateKey(private_key);
    
    // Connect with encryption
    if(client.connect(server_host, 8883)) {
        Serial.println("Secure connection established");
    }
}
```

#### Data Encryption
```cpp
// AES-256 encryption for sensitive data
String encryptData(String plaintext, String key) {
    // Initialize AES
    AES aes;
    aes.set_key((byte*)key.c_str(), 256);
    
    // Encrypt data
    byte cipher[1000];
    aes.encrypt((byte*)plaintext.c_str(), cipher);
    
    // Convert to Base64
    return base64_encode(cipher, plaintext.length());
}

// Secure key storage
void storeSecureKey(String key) {
    // Use ESP32 flash encryption
    preferences.begin("secure", false);
    preferences.putString("enc_key", key);
    preferences.end();
}
```

### Installation Guidelines

#### Site Survey Requirements
1. **Electrical Assessment**
   - Existing electrical infrastructure analysis
   - Load requirements calculation
   - Safety compliance verification
   - Grounding system evaluation

2. **Environmental Conditions**
   - Temperature range assessment
   - Humidity levels monitoring
   - Vibration analysis
   - Dust and moisture protection needs

3. **Communication Coverage**
   - GSM signal strength mapping
   - WiFi availability assessment
   - LoRa network planning
   - Backup communication options

#### Installation Process
```
Step 1: Site Preparation
├── Safety shutdown of electrical systems
├── Installation of mounting brackets
├── Grounding wire installation
└── Weather protection setup

Step 2: Hardware Installation
├── Device mounting and securing
├── Sensor connection and calibration
├── Power system connection
└── Communication setup

Step 3: Software Configuration
├── Device provisioning
├── Network configuration
├── Threshold setting
└── Alert system setup

Step 4: Testing & Commissioning
├── Sensor accuracy verification
├── Communication testing
├── Alert system testing
└── Performance validation
```

### Maintenance Schedule

#### Daily Monitoring
- Real-time dashboard monitoring
- Alert response and resolution
- System status verification
- Data backup verification

#### Weekly Maintenance
- Battery voltage monitoring
- Solar panel cleaning assessment
- Communication signal strength check
- Software update verification

#### Monthly Maintenance
- Physical inspection of devices
- Enclosure integrity check
- Sensor calibration verification
- Performance report generation

#### Annual Maintenance
- Complete system overhaul
- Hardware replacement if needed
- Software major updates
- Performance optimization

### Quality Assurance

#### Testing Standards
- **IEC 61000-4-2:** Electrostatic discharge immunity
- **IEC 61000-4-4:** Electrical fast transient immunity
- **IEC 61000-4-5:** Surge immunity testing
- **IP65:** Ingress protection rating
- **CE Marking:** European conformity
- **FCC Part 15:** Radio frequency emissions

#### Performance Metrics
- **Accuracy:** ±1% for current and voltage measurements
- **Response Time:** <100ms for anomaly detection
- **Availability:** 99.9% uptime target
- **Communication Reliability:** 99.5% message delivery
- **Battery Life:** 15-30 days backup power
- **MTBF:** 50,000 hours minimum

---

**Document Version:** 1.0  
**Last Updated:** September 10, 2024  
**Review Date:** September 10, 2025  
**Classification:** Technical Specification
