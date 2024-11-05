import React from 'react';
import "@fontsource/roboto"; // Defaults to weight 400.
import './Link.css'
import './fonts.css'

function Link({ data, page}) {

  const handleClick = (item) => {
    // Push an event to the dataLayer
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: 'button_click_'+page,
    //   link: item.link,
    //   name: item.name,
    //   description: item.description,
    // });

    // Open the link in a new tab
    window.open(item.link, "_blank");
  };

    return (
        <div className='card'>
      {data.map((item, index) => (
        <button
          className="link"
          key={index}
          onClick={() => handleClick(item)}
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