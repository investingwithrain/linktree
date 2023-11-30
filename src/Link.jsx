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
          <div className='contents'
            // style={{
            //   display: 'flex',
            //   justifyContent: 'center',
            //   alignItems: 'center',
            //   flex: 1,
            // }}
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