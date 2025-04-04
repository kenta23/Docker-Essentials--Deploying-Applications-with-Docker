import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface
export interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Define the Mongoose schema
const TodoSchema: Schema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export type Todo = mongoose.InferSchemaType<typeof TodoSchema>;
export default mongoose.model("Todo", TodoSchema);

