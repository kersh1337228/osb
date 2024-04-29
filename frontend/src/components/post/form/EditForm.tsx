'use client';

import './form.css';
import {
    useEffect,
    useRef
} from 'react';

export default function EditForm() {
    const contentRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        contentRef.current?.dispatchEvent(
            new Event('input', { bubbles: true }));
    }, []);

    return <form className="light">
        <h1 className="section-header">Create new post</h1>
        <div className="field-wrapper">
            <label
                htmlFor="title"
            >
                Title
            </label>
            <input
                className="field_input"
                type="text"
                name="title"
                placeholder="Post title"
                required
            />
        </div>
        <div className="field-wrapper">
            <label
                htmlFor="title"
            >
                Categories
            </label>
            <input
                className="field_input"
                type="text"
                name="title"
                placeholder="Post categories"
                required
            />
        </div>
        <div>
            <label
                htmlFor="content"
            >
                Content
            </label>
            <textarea
                ref={contentRef}
                className="field_input"
                name="content"
                placeholder="Post content"
                required
                onInput={(event) => {
                    const t = event.target as HTMLTextAreaElement;
                    t.style.height = '0';
                    t.style.height = `${t.scrollHeight}px`;
                }}
            >
            </textarea>
        </div>
        <button
            type="submit"
        >
            Submit
        </button>
    </form>;
}
