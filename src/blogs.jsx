import React from 'react';
import "@fontsource/roboto"; // Defaults to weight 400.
import './blogs.css'
import './fonts.css'
import blogFallback from './blog.json';
import { useNavigate } from 'react-router-dom';
import { CONTENT_DOCS, useContent } from './useContent';

function Blogs() {
  const navigate = useNavigate();
  // Editable via /admin; falls back to the bundled blog.json.
  const { data: blog } = useContent(CONTENT_DOCS.blog, blogFallback);
  const item = blog?.list?.[blog?.showThisInLinktree];
  if (item === undefined) {
    return (
      <></>
    )
  }
    return (
        <div className='blogs'>
        <button
          className="blogs-item"
          key={item.folder}
          style={{ backgroundImage: `url(${item.img})`,
          backgroundPosition: 'center' }}
            onClick={() => {
            navigate(`/blog/${item.folder}`);
          }}
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
    </div>
        
    )
    }


export default Blogs