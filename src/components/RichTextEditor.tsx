'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm relative z-0">
      <Editor
        apiKey="i8yysps20jysb3z3hsp964l1yigk8a9x7w8q27mbsu2uoc63" // Public dev key or no-api-key works (will show warning without valid key, but functional)
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(newValue, editor) => {
          onChange(newValue);
        }}
        init={{
          height: 350,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder || 'Mulai mengetik...',
          branding: true,
          promotion: false
        }}
      />
    </div>
  );
}
