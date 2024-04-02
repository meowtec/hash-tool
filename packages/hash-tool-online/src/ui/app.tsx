import Add from './add';
import List from './list';
import Options from './options';
import './app.scss';

export default function App() {
  return (
    <div>
      <h1 className="app-title">Online hash tool</h1>
      <Options />
      <Add />
      <List />
    </div>
  );
}
