import { supabase } from '../lib/supabaseClient';

const PRIORITY_COLORS = {
  high: '#c0392b',
  medium: '#e67e22',
  low: '#27ae60',
};

function TaskItem({ task, onUpdate }) {
  const handleToggle = async () => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !task.is_complete })
      .eq('id', task.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) {
      return;
    }

    const { error } = await supabase.from('tasks').delete().eq('id', task.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <div className={`task-item ${task.is_complete ? 'completed' : ''}`}>
      <div className="task-main">
        <input type="checkbox" checked={task.is_complete} onChange={handleToggle} />
        <div className="task-text">
          <span className="task-title">{task.title}</span>
          <span
            className="badge"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium }}
          >
            {task.priority}
          </span>
        </div>
      </div>
      <button className="del-btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}

export default TaskItem;
