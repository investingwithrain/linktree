import React from 'react';

function BlogPost({ title, content, buttonText }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
            <h1>{title}</h1>
            <p>{content}</p>
            <button style={{ alignSelf: 'flex-end' }}>{buttonText}</button>
        </div>
    );
}

export default BlogPost;