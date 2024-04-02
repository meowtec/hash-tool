import { useRef, MouseEvent, useState } from 'react';
import { useStore } from 'zustand';
import { useAppStore } from '../store';

export default function Add() {
  const addTasks = useAppStore((state) => state.addTasks);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: MouseEvent) => {
    inputRef.current?.click();
  };

  const handleFileInputChange = () => {
    const input = inputRef.current;

    if (!input || !input.files) return;

    addTasks(Array.from(input.files));
    input.value = '';
  };

  const handleOkClick = () => {
    addTasks([text]);
    setText('');
  };

  return (
    <div>
      <textarea
        rows={3}
        className="text-field"
        placeholder="Enter text content here, will be encoded in UTF-8"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <div className="form-action">
        <button type="button" onClick={handleOkClick}>
          Calculate
        </button>
        or
        <button type="button" className="file-add" onClick={handleClick}>
          Add files
          <input type="file" multiple ref={inputRef} onChange={handleFileInputChange} />
        </button>
      </div>
    </div>
  );
}
