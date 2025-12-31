import { useState } from 'react';
import { Question } from '../types';
import { createQuestion, updateQuestion, deleteQuestion } from '../api/questions';
import './QuestionEditor.css';

interface QuestionEditorProps {
  questions: Question[];
  onUpdate: () => void;
}

export default function QuestionEditor({ questions, onUpdate }: QuestionEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditText(question.text);
  };

  const handleSave = async (id: string) => {
    if (!editText.trim()) return;

    setLoading(id);
    try {
      await updateQuestion(id, editText);
      setEditingId(null);
      setEditText('');
      onUpdate();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при сохранении');
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот вопрос?')) return;

    setLoading(id);
    try {
      await deleteQuestion(id);
      onUpdate();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setLoading(null);
    }
  };

  const handleAdd = async () => {
    if (!newQuestionText.trim()) return;

    setIsAdding(true);
    try {
      await createQuestion(newQuestionText);
      setNewQuestionText('');
      onUpdate();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при добавлении');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="question-editor">
      <div className="editor-header">
        <h2>Управление вопросами</h2>
        <div className="add-question-form">
          <textarea
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder="Введите новый вопрос..."
            rows={2}
            className="question-input"
          />
          <button
            onClick={handleAdd}
            disabled={isAdding || !newQuestionText.trim()}
            className="add-button"
          >
            {isAdding ? 'Добавление...' : 'Добавить'}
          </button>
        </div>
      </div>

      <div className="questions-list">
        {questions.length === 0 ? (
          <div className="empty-state">Нет вопросов. Добавьте первый!</div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="question-item">
              {editingId === question.id ? (
                <div className="edit-mode">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="question-input"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleSave(question.id)}
                      disabled={loading === question.id || !editText.trim()}
                      className="save-button"
                    >
                      {loading === question.id ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button onClick={handleCancel} className="cancel-button">
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <div className="question-text">{question.text}</div>
                  <div className="question-actions">
                    <button
                      onClick={() => handleEdit(question)}
                      className="edit-button"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      disabled={loading === question.id}
                      className="delete-button"
                    >
                      {loading === question.id ? '...' : '🗑️'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

