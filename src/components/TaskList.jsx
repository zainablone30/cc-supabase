import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

function TaskList({ session }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setTasks([]);
      return;
    }

    setErrorMessage('');
    setTasks(data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, [session.user.id]);

  useEffect(() => {
    const channel = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session.user.id]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.is_complete;
    }
    if (filter === 'completed') {
      return task.is_complete;
    }
    return true;
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <div className="app-title">Tasks</div>
          <div className="app-user">{session.user.email}</div>
        </div>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      <TaskForm userId={session.user.id} onTaskAdded={fetchTasks} />

      <div className="filter-bar">
        <div className="filter-buttons">
          <button
            type="button"
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <span className="task-count">{filteredTasks.length} tasks</span>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {filteredTasks.length === 0 ? (
        <p className="empty-state">No tasks yet.</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
