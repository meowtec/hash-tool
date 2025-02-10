import { useState } from 'react';
import clsx from 'clsx';
import Add from './add';
import List from './list';
import Options from './options';
import { useAppStore } from '../store';
import './app.scss';

export default function App() {
  const [dragIn, setDragIn] = useState(false);
  const addTasks = useAppStore((state) => state.addTasks);

  return (
    <div
      className={clsx('app', dragIn && 'drag-in')}
      onDragEnter={() => {
        setDragIn(true);
      }}
      onDragLeave={() => {
        setDragIn(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setDragIn(false);
        addTasks(Array.from(e.dataTransfer.files));
      }}
    >
      <h1 className="app-title">
        <span>Online hash tool</span>
      </h1>
      <Options />
      <Add />
      <List />
    </div>
  );
}
