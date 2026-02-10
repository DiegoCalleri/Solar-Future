#define SerialTxControl 2
#define Relay 8                     //Подключено реле
#define RS485Transmit HIGH
#define RS485Receive LOW
#define analog_pin_0 A0


//Переменные для датчика напряжения-------------------------------------------------
float adc_voltage = 0.0;            // Создаем переменную adc_voltage
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
}


void loop(void) {
    int i=0;
    if (Serial.available()) {
        delay(5);

        while (Serial.available()) {
            buffer[i++] = Serial.read();
        }

        if (i>0) {
            buffer[i++]='\0';
            checker(buffer);


        }
    }
}


// Отправить сообщение на физический интерфейс RS-485
void sendInPort(String params_0) {
  digitalWrite(SerialTxControl, RS485Transmit);
  Serial.println(params_0);
  delay(7);
  digitalWrite(SerialTxControl, RS485Receive);
}


float convertVoltage() {
    adc_value = analogRead(analog_pin_0);                     // Считываем показания с аналогово вывода
    adc_voltage = (adc_value * ref_voltage) / 1024.0;         // Определение на входе АЦП
    in_voltage = adc_voltage / (R2/(R1+R2));                  // Расчет напряжения
    return in_voltage;                                        
}


// Вывести значение с аналогового входа
void getAnalog() {
  float result = convertVoltage();                   // Конвертирование напряжения 
  String res = String(result);                                                     
  sendInPort(res);                                 // Отправка на физический интерфейс сообщения
}


// Изменить состояние сигнала
void changePin(int pinNumber, int action) {
  if (String(action) == "0") {
    sendInPort("400");
    digitalWrite(pinNumber, LOW);
  }
  if (String(action) == "1") {
    sendInPort("200");
    digitalWrite(pinNumber, HIGH);
  }
}


// Проверка
void checker(String buffer) {
  if ( buffer.substring(0,1) == "A" ) {
    String x = buffer.substring(0,3);
    getAnalog();
  }

  if ( buffer.substring(0,1) == "D" ) {
    changePin(buffer.substring(2,3).toInt(), buffer.substring(4,6).toInt());
  }
}



