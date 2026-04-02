'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export function RichTextEditor(props: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    [],
  );

  const formats = useMemo(
    () => ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'link', 'image'],
    [],
  );

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${props.className ?? ''}`}
      style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
    >
      <ReactQuill
        theme="snow"
        value={props.value || ''}
        onChange={(html) => props.onChange(html)}
        placeholder={props.placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

