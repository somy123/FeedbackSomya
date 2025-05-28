import { createContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  // ✅ Fetch feedback
  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback?_sort=id&_order=desc`);
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Add feedback
  const addFeedback = async (newFeedback) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });

      const data = await response.json();
      setFeedback([data, ...feedback]);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  // ✅ Delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await fetch(`${API_BASE_URL}/feedback/${id}`, { method: 'DELETE' });
        setFeedback(feedback.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  // ✅ Update feedback item
  const updateFeedback = async (id, updItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem),
      });

      const data = await response.json();
      setFeedback(feedback.map((item) => (item.id === id ? data : item)));
      setFeedbackEdit({
        item: {},
        edit: false,
      });
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  // Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    });
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
