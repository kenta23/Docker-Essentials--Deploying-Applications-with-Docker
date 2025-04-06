import './App.css'


import { useEffect, useState } from "react"
import { Button } from '../components/ui/button'
import { Input } from "../components/ui/input"
import { Card, } from "../components/ui/card"
import { CheckCircle, Edit, XCircle } from 'lucide-react';
import axios from 'axios';



type Todo = {
  id: string
  title: string
  completed: boolean
}

const App = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    // Fetch todos on component mount
    const fetchTodos = async () => {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/todos');
      const data = await response.data;
      setTodos(data);
      setLoading(false);
    };

    fetchTodos();

  }, []);


  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const response = await axios.post('http://localhost:3000/todos', { title: newTodo, completed: false });
    const data = await response.data;
    
    if(response.status === 201) { 
      console.log(data);
      setTodos([...todos, data]);
      setNewTodo('');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/todos/${id}`,
        { completed: !completed } // No need to stringify; axios will handle that
      );
  
      if (res.status === 200) { 
          // Update state with new todo data after successful update
        setTodos(
            todos.map((todo) =>
            todo?.id === id ? { ...todo, completed: !completed } : todo
         )
       );
      }
  
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  
  

  const deleteTodo = async (id: string) => {
    await axios.delete(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const editTodo = async () => {
    if (!editingTitle.trim()) return;
    const response = await axios.post(`http://localhost:3000/todos/${editingId}`,{ title: editingTitle });

    console.log('title',editingTitle);

    const status = response.status
     
    if(status === 200) { 
      setTodos(todos.map(todo => todo.id === editingId ? { ...todo, title: response.data } : todo));

      setEditingId(null);
      setEditingTitle('');
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingId ? { ...todo, title: response.data.title } : todo
        ))
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl p-8 bg-white shadow-xl rounded-xl">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Todos List</h1>

        <div className="mb-6 flex items-center gap-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={addTodo} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
            Add
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {todos.sort().map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-4 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <Button
                    variant="link"
                    className={`text-xl ${todo.completed ? 'text-green-500' : 'text-gray-600'}`}
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                  >
                    {todo.completed ? <CheckCircle /> : <XCircle />}
                  </Button>
                  {editingId === todo.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="p-2 border-2 border-gray-300 rounded"
                      />
                      <Button onClick={editTodo} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <span
                      className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}
                    >
                      {todo?.title || 'No title'}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                >
                  <XCircle size={18} />
                </Button>
                <Button
                  onClick={() => startEditing(todo.id, todo.title)}
                  className="bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-700"
                >
                  <Edit size={18} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}



export default App
