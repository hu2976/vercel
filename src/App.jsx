import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Story from './pages/Story'
import Design from './pages/Design'
import Vibecoding from './pages/Vibecoding'
import VibecodingDetail from './pages/VibecodingDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:slug" element={<Story />} />
        <Route path="/design" element={<Design />} />
        <Route path="/vibecoding" element={<Vibecoding />} />
        <Route path="/vibecoding/:slug" element={<VibecodingDetail />} />
        {/* 博客暂时不在导航中，但路由保留 */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Layout>
  )
}

export default App
