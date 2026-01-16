# ESP8266 MQTT Temperature and Humidity monitor

![Languages used](https://img.shields.io/github/languages/count/isadfrn/esp8266-mqtt-temp?style=flat-square)
![Repository size](https://img.shields.io/github/repo-size/isadfrn/esp8266-mqtt-temp?style=flat-square)
![Last commit](https://img.shields.io/github/last-commit/isadfrn/esp8266-mqtt-temp?style=flat-square)

## About

This project uses an ESP8266 to read temperature and humidity data from a DHT11 sensor and send it to an MQTT broker. A React-based web dashboard provides real-time visualization of the sensor data.

## Project Structure

```
esp8266-mqtt-temp/
├── main/                          # ESP8266 source code
│   ├── esp8266-mqtt-temp_main.c  # Main application code
│   ├── vars_config.h.example     # Configuration template
│   └── CMakeLists.txt            # ESP-IDF component config
├── dashboard/                     # React web dashboard
│   ├── src/                      # React source files
│   │   ├── App.jsx              # Main dashboard component
│   │   └── App.css              # Dashboard styles
│   └── package.json             # Node.js dependencies
├── config/                       # Configuration files
│   └── mosquitto.conf           # MQTT broker configuration
├── scripts/                      # Utility scripts
│   ├── setup.sh                 # Setup script (install dependencies + start containers)
│   ├── run-all.sh               # Run everything (setup + dashboard)
│   └── run-dashboard.sh         # Run dashboard only
├── docs/                         # Documentation
│   ├── report/                  # LaTeX report project
│   └── slides.pdf               # Presentation slides
├── docker-compose.yml           # Docker MQTT broker setup
├── CMakeLists.txt               # ESP-IDF project config
├── Makefile                     # ESP8266 build system
└── README.md                    # This file
```

## Prerequisites

### For ESP8266 Development
- ESP-IDF (Espressif IoT Development Framework)
- USB cable to connect ESP8266
- DHT11 temperature and humidity sensor

### For Dashboard and MQTT Broker
- **Docker** and **Docker Compose**
  - Install: `sudo apt-get install docker.io docker-compose`
- **Node.js** (v16 or higher) and **npm**
  - Install: `sudo apt-get install nodejs npm`

## Quick Start

### Single Command Setup (Recommended)

```bash
chmod +x scripts/*.sh
./scripts/run-all.sh
```

This will:
1. Check for Docker and Node.js
2. Start the MQTT broker
3. Install dashboard dependencies
4. Launch the dashboard

### Manual Setup

#### 1. Setup Dependencies and Start MQTT Broker

```bash
./scripts/setup.sh
```

This script will:
- Check for Docker and Node.js
- Start the MQTT broker using Docker
- Install dashboard dependencies

The MQTT broker will be available on:
- **MQTT Port**: 1883
- **WebSocket Port**: 9001 (for dashboard)

#### 2. Configure ESP8266

1. Copy the configuration template:
   ```bash
   cp main/vars_config.h.example main/vars_config.h
   ```

2. Edit `main/vars_config.h` with your settings:
   ```c
   #define WIFI_SSID "your_wifi_ssid"
   #define WIFI_PASS "your_wifi_password"
   #define MQTT_BROKER_URI "mqtt://your_broker_ip"
   #define MQTT_TEMPERATURE_TOPIC "mestrado/iot/aluno/isabella/temperatura"
   #define MQTT_HUMIDITY_TOPIC "mestrado/iot/aluno/isabella/umidade"
   ```

#### 3. Build and Flash ESP8266

```bash
make clean
make all
make flash
make monitor
```

#### 4. Start Dashboard

```bash
./scripts/run-dashboard.sh
```

The dashboard will be available at `http://localhost:5173`

## Running the Project

### Setup Only (First Time)

```bash
./scripts/setup.sh
```

### Run Dashboard Only

```bash
./scripts/run-dashboard.sh
```

### Run Everything (Setup + Dashboard)

```bash
./scripts/run-all.sh
```

## MQTT Topics

The ESP8266 publishes to the following MQTT topics:
- **Temperature**: `mestrado/iot/aluno/isabella/temperatura`
- **Humidity**: `mestrado/iot/aluno/isabella/umidade`

You can subscribe to these topics using:
```bash
mosquitto_sub -h localhost -t "mestrado/iot/aluno/isabella/temperatura"
mosquitto_sub -h localhost -t "mestrado/iot/aluno/isabella/umidade"
```

## Dashboard Configuration

The dashboard can be configured using environment variables. Create a `.env` file in the `dashboard/` directory:

```env
VITE_MQTT_BROKER_URL=ws://localhost:9001
VITE_TEMPERATURE_TOPIC=mestrado/iot/aluno/isabella/temperatura
VITE_HUMIDITY_TOPIC=mestrado/iot/aluno/isabella/umidade
```

If not specified, the dashboard uses the default values shown above.

## Troubleshooting

### MQTT Broker Issues
- Ensure Docker is running: `docker ps`
- Check broker logs: `docker-compose logs mosquitto`
- Verify ports are not in use: `netstat -an | grep 1883`

### Dashboard Connection Issues
- Verify MQTT broker is running and accessible
- Check WebSocket is enabled on port 9001
- Verify MQTT topics match ESP8266 configuration
- Check browser console for errors

### ESP8266 Not Publishing Data
- Verify WiFi credentials in `vars_config.h`
- Check MQTT broker URI is correct
- Ensure sensor is properly connected to GPIO pin 4
- Monitor serial output: `make monitor`

## Dashboard

A React-based web dashboard is available in the `dashboard/` directory to visualize sensor data in real-time. The dashboard features:
- Real-time temperature and humidity display
- Responsive design for smartphones and notebooks
- MQTT WebSocket connection
- Connection status indicator

See [dashboard/README.md](./dashboard/README.md) for detailed dashboard documentation.

## Contributing

This repository uses [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), so if you want to contribute:

- create a branch from develop branch;
- make your contributions;
- open a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to develop branch;
- wait for discussion and future approval;

I thank you in advance for any contribution.

## Status

Finished

## License

[MIT](./LICENSE)
