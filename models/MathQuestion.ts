import mongoose from 'mongoose';

const mathQuestionsSchema = new mongoose.Schema({
  schoolClass: { type: Number, required: true },
  part: { type: Number, required: true },

  topic: { type: String, required: true },
  partition: { type: String, required: true },
  page: { type: Number, required: true },
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  type: { type: String, enum: ['single', 'multiple'], required: true },
  options: [
    {
      id: { type: String, enum: ['a', 'b', 'c', 'd', 'e'], required: true },
      text: { type: String, required: true },
    },
  ],

  correctOptions: [
    { type: String, enum: ['a', 'b', 'c', 'd', 'e'], required: true },
  ],
});

// Проверяем, существует ли уже модель, чтобы избежать повторного определения
const MathQuestions =
  mongoose.models.MathQuestions ||
  mongoose.model('MathQuestions', mathQuestionsSchema);

export default MathQuestions;
