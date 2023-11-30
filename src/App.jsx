import { useState } from 'react'
import './App.css'
import "@fontsource/roboto"; // Defaults to weight 400.
import Link from './Link.jsx';
import logo from '/rainishere_s.png'
import './fonts.css'
import data from './Data.json';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.youtube.com/channel/UC7v5yfvZhs-d5opF575AEhA" target="_blank">
          <img src={logo} className="logo" alt="Rainishere logo" />
        </a>
      </div>
      <div className='title'>Rainishere</div>
      <div className="card">
        <Link />
        
      </div>
      <p className="read-the-docs">以上的{data.length}個連結是RainIsHere的真實社交平台及獨家優惠連結，其他沒有登記的平台及連結全部屬於虛假帳戶或假平台，請大家小心騙徒喔！</p>
    </>
  )
}

export default App
