import React from 'react';
import "@fontsource/roboto"; // Defaults to weight 400.
import './Link.css'
import './fonts.css'
import data from './Data.json';

function Link() {

      
    return (
        <div>
      {data.map((item, index) => (
        <button
          className="link"
          key={index}
          onClick={() => window.open(item.link, "_blank")}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{ width: '1.6em', marginRight: '0.4em' }}
            />
            <span>{item.name}</span>
          </div>
        </button>
      ))}
    </div>
        
    )
    }


export default Link