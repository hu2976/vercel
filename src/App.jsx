import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
import Design from './pages/Design'
import Vibecoding from './pages/Vibecoding'
import VibecodingDetail from './pages/VibecodingDetail'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:slug" element={<Story />} />
        <Route path="/design" element={<Design />} />
        <Route path="/vibecoding" element={<Vibecoding />} />
        <Route path="/vibecoding/:slug" element={<VibecodingDetail />} />
        {/* 不存在的地址（含已删掉的 /blog）一律回首页，不留空白页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
