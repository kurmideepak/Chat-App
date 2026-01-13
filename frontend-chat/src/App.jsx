import './App.css'
import JoinCreateChat from './components/JoinCreateChat'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <JoinCreateChat />
    </div>  
  )
}
