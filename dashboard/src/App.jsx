import { useState, useEffect, useRef } from 'react'
import mqtt from 'mqtt'
import './App.css'

function App() {
  const [temperature, setTemperature] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)

  useEffect(() => {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001'
    const temperatureTopic = import.meta.env.VITE_TEMPERATURE_TOPIC || 'mestrado/iot/aluno/isabella/temperatura'
    const humidityTopic = import.meta.env.VITE_HUMIDITY_TOPIC || 'mestrado/iot/aluno/isabella/umidade'

    console.log('Connecting to MQTT broker:', brokerUrl)

    const client = mqtt.connect(brokerUrl, {
      clientId: `dashboard_${Math.random().toString(16).substr(2, 8)}`,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    })

    clientRef.current = client

    client.on('connect', () => {
      console.log('Connected to MQTT broker')
      setConnected(true)
      
      client.subscribe(temperatureTopic, (err) => {
        if (err) {
          console.error('Error subscribing to temperature topic:', err)
        } else {
          console.log('Subscribed to temperature topic:', temperatureTopic)
        }
      })

      client.subscribe(humidityTopic, (err) => {
        if (err) {
          console.error('Error subscribing to humidity topic:', err)
        } else {
          console.log('Subscribed to humidity topic:', humidityTopic)
        }
      })
    })

    client.on('message', (topic, message) => {
      const value = parseInt(message.toString(), 10)
      
      if (topic === temperatureTopic) {
        console.log('Temperature received:', value)
        setTemperature(value)
      } else if (topic === humidityTopic) {
        console.log('Humidity received:', value)
        setHumidity(value)
      }
    })

    client.on('error', (error) => {
      console.error('MQTT error:', error)
      setConnected(false)
    })

    client.on('close', () => {
      console.log('MQTT connection closed')
      setConnected(false)
    })

    client.on('offline', () => {
      console.log('MQTT client offline')
      setConnected(false)
    })

    return () => {
      if (clientRef.current) {
        clientRef.current.end()
      }
    }
  }, [])

  return (
    <div className="app">
      <h1 className="title">ESCRITÓRIO</h1>
      
      <div className="cards-container">
        <div className="sensor-card">
          <div className="card-content">
            <div className="icon-container">
              <svg className="icon thermometer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                <line x1="10" y1="2" x2="10" y2="4"/>
                <line x1="14" y1="2" x2="14" y2="4"/>
                <line x1="10" y1="20" x2="10" y2="22"/>
                <line x1="14" y1="20" x2="14" y2="22"/>
              </svg>
            </div>
            <div className="value-container">
              <span className="value">
                {temperature !== null ? `${temperature} °C` : '--'}
              </span>
            </div>
          </div>
        </div>

        <div className="sensor-card">
          <div className="card-content">
            <div className="icon-container">
              <svg className="icon droplets" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
                <path d="M7.16 6.6c-.43-.8.1-1.5.87-1.5h1.48c.77 0 1.3.7.87 1.5-.43.8-1.48 2-1.48 2s-1.05-1.2-1.48-2z"/>
              </svg>
            </div>
            <div className="value-container">
              <span className="value">
                {humidity !== null ? `${humidity}%` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
        {connected ? 'Conectado' : 'Desconectado'}
      </div>
    </div>
  )
}

export default App
