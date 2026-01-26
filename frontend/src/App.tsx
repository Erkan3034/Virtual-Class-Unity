import { DebugDashboard } from './components/DebugDashboard'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <DebugDashboard />
    </div>
  )
}

export default App
