import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './blog.css';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import blog from './blog.json';

function Blog() {

    const baseUrl = 'https://raw.githubusercontent.com/investingwithrain/blog_src/main';

    const { folder } = useParams();
    const item = blog.list[folder];
    const [markdown, setMarkdown] = useState('');

    if (item.published === false) {
        return (
            <></>
        )
    }

    useEffect(() => {
        fetch(`${baseUrl}/${item.folder}/${item.md}`)
        .then(response => response.text())
        .then(text => {
            // console.log(`${baseUrl}/${folder}/${md}`);
            const preurl = `${baseUrl}/${item.folder}/`;
            const updatedText = text.replace(/!\[(.*?)\]\((.*?)\)/g, `![$1](${preurl}$2)`);
            setMarkdown(updatedText);
        });
    }, []);
    return (

        <div className='blog-content'>
            <h1>{item.description}</h1>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
            <button
                onClick={() => window.open(item.link, "_blank")}
            >{item.linkName}</button>
        </div>
    );
}

export default Blog;




