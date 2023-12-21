import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './blog.css';
import {Button} from '@mui/material';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import {markdown} from './blogContents';


function Blog() {


    const location = useLocation();
    const { title, content, link, linkName } = location.state;
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        fetch('./blog.md')
        .then(response => response.text())
        .then(text => setMarkdown(text));
    }, []);

    return (
        <div className='blog-content'>
            <h1>{title}</h1>
            {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
            <Button
            variant="contained"
                onClick={() => window.open(link, "_blank")}
            >{linkName}</Button>
        </div>
    );
}

export default Blog;