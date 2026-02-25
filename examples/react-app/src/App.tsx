import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [date, setDate] = useState<any>(null);
  const datepickerRef = useRef<any>(null);

  useEffect(() => {
    if (datepickerRef.current) {
      datepickerRef.current.addEventListener('dateSelect', (e: any) => {
        setDate(e.detail);
      });
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" style={{ width: '100px', display: 'block', margin: '0 auto 2rem' }} />
        </a>
      </div>
      <h1>React + ngxsmk-datepicker</h1>

      <div style={{ marginTop: '2rem' }}>
        <p>This is a React App rendering the Angular Web Component directly.</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          {/* Use the custom element natively */}
          <ngxsmk-datepicker
            ref={datepickerRef}
            mode="range"
            theme="light"
            style={{ width: '100%', maxWidth: '300px' }}
            classes={JSON.stringify({ header: 'bg-indigo-600 text-white rounded-t-lg' })}
          ></ngxsmk-datepicker>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px', color: '#333' }}>
          <strong>Selected Date (In React State):</strong>
          <pre style={{ marginTop: '1rem' }}>
            {date ? JSON.stringify(date, null, 2) : 'No date selected'}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default App
