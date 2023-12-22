import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './blog.css';
import {Button} from '@mui/material';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import {markdown} from './blogContents';


function Blog() {

    const baseUrl = 'https://raw.githubusercontent.com/investingwithrain/blog_src/main';

    const location = useLocation();
    const [markdown, setMarkdown] = useState('');
    const { description:description, img:img, folder:folder, md:md, link:link, linkName:linkName} = location.state;


    useEffect(() => {
        fetch(`${baseUrl}/${folder}/${md}`)
        .then(response => response.text())
        .then(text => {
            // console.log(`${baseUrl}/${folder}/${md}`);
            const preurl = `${baseUrl}/${folder}/`;
            const updatedText = text.replace(/!\[(.*?)\]\((.*?)\)/g, `![$1](${preurl}$2)`);
            setMarkdown(updatedText);
        });
    }, []);
    return (

        <div className='blog-content'>
            <h1>{description}</h1>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
            <Button
            variant="contained"
                onClick={() => window.open(link, "_blank")}
            >{linkName}</Button>
        </div>
    );
}

export default Blog;




