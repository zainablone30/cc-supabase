import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function TaskForm({ userId, onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('Title is required.');
      return;
    }

    const { error } = await supabase.from('tasks').insert([
      {
        title: title.trim(),
        priority,
        user_id: userId,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle('');
    setPriority('medium');

    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a task"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <select value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
