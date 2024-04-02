import { useAppStore } from '../store';
import { HashView } from './components/hash';

export default function List() {
  const { hashesTasks, options, removeTask } = useAppStore();

  return (
    <div className="task-list">
      {hashesTasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="hash-pair">
            {typeof task.content === 'string' ? (
              <>
                <div className="hash-label">text:</div>
                {task.content}
              </>
            ) : (
              <>
                <div className="hash-label">file:</div>
                {task.content.name}
              </>
            )}
          </div>

          {options.hashTypes.map((type) => (
            <div key={type} className="hash-pair">
              <div className="hash-label">{type}:</div>
              <HashView hashState={task.hashes[type] ?? null} />
            </div>
          ))}

          <button type="button" className="task-del" onClick={() => removeTask(task.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
