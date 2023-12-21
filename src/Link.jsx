import React from 'react';
import "@fontsource/roboto"; // Defaults to weight 400.
import './Link.css'
import './fonts.css'
import data from './Data.json';
import { useNavigate } from 'react-router-dom';

function Link() {
    return (
        <div className='card'>
      {data.map((item, index) => (
        <button
          className="link"
          key={index}
          onClick={() => window.open(item.link, "_blank")}
          >
          <div className='contents'
          >
            <img
              src={item.img}
              alt={item.name}
            />
            <h3>{item.name}</h3>
            <h4>{item.description}</h4>
          </div>
        </button>
      ))}
    </div>
        
    )
    }


export default Link