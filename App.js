import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) setTodos(storedTodos);
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (storedDarkMode !== null) setDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      if (editingId !== null) {
        setTodos(todos.map(todo => 
          todo.id === editingId ? { ...todo, text: inputValue, category, dueDate, priority } : todo
        ));
        setEditingId(null);
      } else {
        setTodos([...todos, { 
          text: inputValue, 
          completed: false, 
          category, 
          dueDate, 
          priority,
          id: Date.now() 
        }]);
      }
      setInputValue('');
      setDueDate('');
      setPriority('medium');
      setCategory('personal');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    setInputValue(todoToEdit.text);
    setCategory(todoToEdit.category);
    setDueDate(todoToEdit.dueDate);
    setPriority(todoToEdit.priority);
    setEditingId(id);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#FF5252';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#6C63FF';
    }
  };

  const filteredAndSortedTodos = todos
    .filter(todo => {
      if (filter === 'all') return true;
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return todo.category === filter || todo.priority === filter;
    })
    .filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <header>
          <div className="logo-container">
            <img src="/logo.svg" alt="TodoMaster Logo" className="logo" />
            <h1>TodoMaster</h1>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <div className="form-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="todo-select">
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="shopping">Shopping</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="todo-date"
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="todo-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit" className="add-btn">{editingId !== null ? 'Update Task' : 'Add Task'}</button>
        </form>
        <div className="filters">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            <option value="default">Default</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
        <ul className="todo-list">
          {filteredAndSortedTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <div className="todo-details">
                  <span className="category">{todo.category}</span>
                  <span className="due-date">{todo.dueDate}</span>
                  <span className="priority" style={{backgroundColor: getPriorityColor(todo.priority)}}>
                    {todo.priority}
                  </span>
                </div>
              </div>
              <div className="todo-actions">
                <button onClick={() => editTodo(todo.id)} className="edit-btn">Edit</button>
                <button onClick={() => removeTodo(todo.id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;