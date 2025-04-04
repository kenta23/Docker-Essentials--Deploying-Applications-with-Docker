import type { BunRequest } from 'bun';
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const CORS_HEADERS = {
  headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type',
  },
};

type TodoInput = {
  title: string;
  completed: boolean;
};
Bun.serve({
  port: 3000,
  development: true,
  routes: {
    // Get all todos
    "/todos": {
      GET: async () => {
        try {
          const todos = await prisma.todo.findMany();
          return new Response(JSON.stringify(todos), {
            status: 200,
            headers: CORS_HEADERS.headers,
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error }), {
            status: 500,
            headers: CORS_HEADERS.headers,
          });
        }
      },

      // Create a new todo
      POST: async (req: BunRequest) => {
        try {
          const { title, completed } = await req.json();
          const newTodo = await prisma.todo.create({
            data: { title, completed },
          });

          return new Response(JSON.stringify(newTodo), {
            status: 201,
            headers: CORS_HEADERS.headers,
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: CORS_HEADERS.headers,
          });
        }
      },
    },

    // Update todo status
    "/todos/status": {
      POST: async (req: BunRequest) => {
        try {
          const { completed, id } = await req.json();

          const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { completed },
          });

          return new Response(JSON.stringify(updatedTodo), {
            status: 200,
            headers: CORS_HEADERS.headers,
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: CORS_HEADERS.headers,
          });
        }
      },
    },

    // Update a todo (title or completed status)
    "/todos/:id": {
      POST: async (req: BunRequest) => {
        try {
          const { id } = req.params;
          const { completed, title } = await req.json();

          const updateData: { completed?: boolean; title?: string } = {};
          if (completed !== undefined) updateData.completed = completed;
          if (title !== undefined) updateData.title = title;

          const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateData,
          });

          return new Response(JSON.stringify(updatedTodo), {
            status: 200,
            headers: CORS_HEADERS.headers,
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: CORS_HEADERS.headers,
          });
        }
      },

      DELETE: async (req: BunRequest) => {
        try {
          const { id } = req.params;
          await prisma.todo.delete({
            where: { id },
          });

          return new Response(JSON.stringify({ message: "Deleted successfully" }), {
            status: 200,
            headers: CORS_HEADERS.headers,
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error }), {
            status: 400,
            headers: CORS_HEADERS.headers,
          });
        }
      },
    },
  },

  // Catch-all fetch route
  fetch(req, res) {
    return new Response("Hello World", { headers: CORS_HEADERS.headers });
  },
});