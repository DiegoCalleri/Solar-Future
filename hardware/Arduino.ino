#define SerialTxControl 2
#define Relay 8                     //Подключено реле
#define RS485Transmit HIGH
#define RS485Receive LOW
#define analog_pin_0 A0


//Переменные для датчика напряжения-------------------------------------------------
float adc_voltage = 0.0;            //a Создаем переменную adc_voltage
float in_voltage = 0.0;             // Создаем переменную in_voltage
float R1 = 30000.0;                 // Задаем номинал резистора R1
float R2 = 7500.0;                  // Задаем номинал резистора R2
float ref_voltage = 5.0;            // Задаем опорное напряжение
int adc_value = 0;                  // Создаем переменную для хранения показаний
//----------------------------------------------------------------------------------


char buffer[100];
byte state = 0;


unsigned long ping_next, t;
unsigned int ping_to = 500;


void setup(void) {
    Serial.begin(9600);
    pinMode(13, OUTPUT);
    pinMode(Relay, OUTPUT);                         
    pinMode(SerialTxControl, OUTPUT);
    digitalWrite(SerialTxControl, RS485Receive);
    
    // Логирование старта
    Serial.println("[SETUP] Arduino initialized");
    Serial.println("[SETUP] RS485 in receive mode");
    Serial.println("[SETUP] Ready to receive commands");
}


void loop(void) {
    int i=0;
    if (Serial.available()) {
        Serial.print("[LOOP] Data available, bytes: ");
        Serial.println(Serial.available());
        delay(5);

        // Очистка буфера перед чтением
        memset(buffer, 0, sizeof(buffer));
        
        while (Serial.available() && i < 99) {
            buffer[i++] = Serial.read();
        }

        if (i>0) {
            buffer[i]='\0';  // Исправлено: правильный индекс для null-terminator
            
            Serial.print("[LOOP] Received buffer (length=");
            Serial.print(i);
            Serial.print("): [");
            for(int j=0; j<i; j++) {
                Serial.print((char)buffer[j]);
            }
            Serial.println("]");
            
            Serial.print("[LOOP] Buffer as string: \"");
            Serial.print(buffer);
            Serial.println("\"");
            
            checker(String(buffer));
        } else {
            Serial.println("[LOOP] No data read after available check");
        }
    }
}


// Отправить сообщение на физический интерфейс RS-485
void sendInPort(String params_0) {
  Serial.print("[SEND] Switching to TRANSMIT mode, sending: \"");
  Serial.print(params_0);
  Serial.println("\"");
  
  digitalWrite(SerialTxControl, RS485Transmit);
  delay(2);  // Небольшая задержка перед отправкой
  Serial.println(params_0);
  delay(7);
  
  digitalWrite(SerialTxControl, RS485Receive);
  Serial.println("[SEND] Switched back to RECEIVE mode");
}


float convertVoltage() {
    adc_value = analogRead(analog_pin_0);                     // Считываем показания с аналогово вывода
    Serial.print("[VOLTAGE] ADC raw value: ");
    Serial.println(adc_value);
    
    adc_voltage = (adc_value * ref_voltage) / 1024.0;         // Определение на входе АЦП
    Serial.print("[VOLTAGE] ADC voltage: ");
    Serial.println(adc_voltage);
    
    in_voltage = adc_voltage / (R2/(R1+R2));                  // Расчет напряжения
    Serial.print("[VOLTAGE] Calculated voltage: ");
    Serial.println(in_voltage);
    
    return in_voltage;                                        
}


// Вывести значение с аналогового входа
void getAnalog() {
  Serial.println("[ANALOG] getAnalog() called");
  float result = convertVoltage();                   // Конвертирование напряжения 
  String res = String(result, 2);  // Форматирование с 2 знаками после запятой
  Serial.print("[ANALOG] Formatted result: \"");
  Serial.print(res);
  Serial.println("\"");
  sendInPort(res);                                 // Отправка на физический интерфейс сообщения
}


// Изменить состояние сигнала
void changePin(int pinNumber, int action) {
  Serial.print("[PIN] changePin called - pinNumber: ");
  Serial.print(pinNumber);
  Serial.print(", action: ");
  Serial.println(action);
  
  if (action == 0) {
    Serial.println("[PIN] Setting pin LOW");
    digitalWrite(pinNumber, LOW);
    sendInPort("400");
    Serial.print("[PIN] Pin ");
    Serial.print(pinNumber);
    Serial.println(" set to LOW");
  }
  else if (action == 1) {
    Serial.println("[PIN] Setting pin HIGH");
    digitalWrite(pinNumber, HIGH);
    sendInPort("200");
    Serial.print("[PIN] Pin ");
    Serial.print(pinNumber);
    Serial.println(" set to HIGH");
  }
  else {
    Serial.print("[PIN] ERROR: Unknown action value: ");
    Serial.println(action);
  }
}


// Проверка
void checker(String buffer) {
  Serial.print("[CHECKER] Processing command: \"");
  Serial.print(buffer);
  Serial.print("\", length: ");
  Serial.println(buffer.length());
  
  if (buffer.length() == 0) {
    Serial.println("[CHECKER] ERROR: Empty buffer");
    return;
  }
  
  char firstChar = buffer.charAt(0);
  Serial.print("[CHECKER] First character: '");
  Serial.print(firstChar);
  Serial.println("'");
  
  if (firstChar == 'A' || firstChar == 'a') {
    Serial.println("[CHECKER] Analog command detected");
    if (buffer.length() >= 3) {
      String x = buffer.substring(0, 3);
      Serial.print("[CHECKER] Analog command code: \"");
      Serial.print(x);
      Serial.println("\"");
    }
    getAnalog();
  }
  else if (firstChar == 'D' || firstChar == 'd') {
    Serial.println("[CHECKER] Digital pin command detected");
    
    // Формат команды: DXXYY (D + 2 цифры пина + 2 цифры действия) = 5 символов
    if (buffer.length() < 5) {
      Serial.print("[CHECKER] ERROR: Buffer too short for digital command. Expected >=5, got ");
      Serial.println(buffer.length());
      Serial.print("[CHECKER] Full buffer: \"");
      Serial.print(buffer);
      Serial.println("\"");
      return;
    }
    
    // Парсинг: формат DXXYY где XX - номер пина (2 цифры), YY - действие (2 цифры)
    // Пример: D0501 = D + pin 05 + action 01
    String pinStr = buffer.substring(1, 3);  // Символы 1-2 (после 'D') = "05"
    String actionStr = buffer.substring(3, 5); // Символы 3-4 = "01"
    
    Serial.print("[CHECKER] Pin string: \"");
    Serial.print(pinStr);
    Serial.print("\", Action string: \"");
    Serial.print(actionStr);
    Serial.println("\"");
    
    int pinNumber = pinStr.toInt();
    int action = actionStr.toInt();
    
    Serial.print("[CHECKER] Parsed - pinNumber: ");
    Serial.print(pinNumber);
    Serial.print(", action: ");
    Serial.println(action);
    
    if (pinNumber == 0 && pinStr != "00" && pinStr != "0") {
      Serial.println("[CHECKER] WARNING: Pin number parsing may have failed (got 0)");
    }
    
    changePin(pinNumber, action);
  }
  else {
    Serial.print("[CHECKER] ERROR: Unknown command type: '");
    Serial.print(firstChar);
    Serial.println("'");
    Serial.print("[CHECKER] Full buffer: \"");
    Serial.print(buffer);
    Serial.println("\"");
  }
}



