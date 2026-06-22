import Sidebar from "./components/Sidebar"
import Resumes from "./pages/Resumes"

export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 flex-1 min-h-screen bg-gray-50">
        <Resumes />
      </main>
    </div>
  )
}