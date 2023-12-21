import React from 'react';
import "@fontsource/roboto"; // Defaults to weight 400.
import './blogs.css'
import './fonts.css'
import blog from './blog.json';
import { useNavigate } from 'react-router-dom';

function Blogs() {
  const navigate = useNavigate();
    return (
        <div className='blogs'>
      {blog.map((item, index) => (
        <button
          className="blogs-item"
          key={index}
          style={{ backgroundImage: `url(${item.img})`,
          backgroundPosition: 'center' }}
          onClick={() => navigate('/blog', { state: { title: item.name, content: item.description, link: item.link, linkName: item.linkName } })}
          >
          <div className='blogs-contents'
          >
            {/* <img
              src={item.img}
              alt={item.name}
            /> */}
            {/* <h3>{item.name}</h3>
            <h4>{item.description}</h4> */}
          </div>
        </button>
      ))}
    </div>
        
    )
    }


export default Blogs