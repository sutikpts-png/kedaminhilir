'use client';

import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      if (!editorRef.current.innerHTML || value === '') {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const promptLink = () => {
    const url = prompt('Masukkan URL Link (contoh: https://google.com):');
    if (url) {
      execCommand('createLink', url);
    }
  };

  if (!isMounted) {
    return <div className="h-64 w-full bg-gray-50 border border-gray-200 rounded-lg animate-pulse flex items-center justify-center text-gray-400">Menyiapkan editor...</div>;
  }

  const ToolbarButton = ({ icon, onClick, title }: { icon: string, onClick: () => void, title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-green-700 rounded transition-colors focus:outline-none"
    >
      <i className={icon}></i>
    </button>
  );

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col shadow-sm">
      {/* Custom Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 border-b border-gray-300">
        <button type="button" onClick={() => execCommand('formatBlock', 'H2')} className="px-3 h-8 text-sm font-bold text-gray-600 hover:bg-gray-200 hover:text-green-700 rounded">H2</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'H3')} className="px-3 h-8 text-sm font-semibold text-gray-600 hover:bg-gray-200 hover:text-green-700 rounded">H3</button>
        <button type="button" onClick={() => execCommand('formatBlock', 'P')} className="px-3 h-8 text-sm text-gray-600 hover:bg-gray-200 hover:text-green-700 rounded">P</button>
        
        <div className="w-px h-5 bg-gray-400 mx-1"></div>
        
        <ToolbarButton icon="fas fa-bold" title="Bold" onClick={() => execCommand('bold')} />
        <ToolbarButton icon="fas fa-italic" title="Italic" onClick={() => execCommand('italic')} />
        <ToolbarButton icon="fas fa-underline" title="Underline" onClick={() => execCommand('underline')} />
        <ToolbarButton icon="fas fa-strikethrough" title="Strikethrough" onClick={() => execCommand('strikeThrough')} />
        
        <div className="w-px h-5 bg-gray-400 mx-1"></div>
        
        <ToolbarButton icon="fas fa-list-ul" title="Bullet List" onClick={() => execCommand('insertUnorderedList')} />
        <ToolbarButton icon="fas fa-list-ol" title="Numbered List" onClick={() => execCommand('insertOrderedList')} />
        <ToolbarButton icon="fas fa-outdent" title="Outdent" onClick={() => execCommand('outdent')} />
        <ToolbarButton icon="fas fa-indent" title="Indent" onClick={() => execCommand('indent')} />
        
        <div className="w-px h-5 bg-gray-400 mx-1"></div>
        
        <ToolbarButton icon="fas fa-link" title="Insert Link" onClick={promptLink} />
        <ToolbarButton icon="fas fa-eraser" title="Remove Formatting" onClick={() => execCommand('removeFormat')} />
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        {(!value || value === '') && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder || 'Mulai mengetik...'}
          </div>
        )}
        <div 
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="p-4 min-h-[250px] outline-none prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      </div>
    </div>
  );
}
