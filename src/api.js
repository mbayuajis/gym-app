const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getExercises: () => request('/exercises'),
  createExercise: (data) => request('/exercises', { method: 'POST', body: JSON.stringify(data) }),
  updateExercise: (id, data) => request(`/exercises/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteExercise: (id) => request(`/exercises/${id}`, { method: 'DELETE' }),
  autoFetchYoutube: (name) => request('/exercises/auto-fetch-youtube', { method: 'POST', body: JSON.stringify({ name }) }),

  getWorkouts: () => request('/workouts'),
  createWorkout: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),

  getStats: () => request('/stats'),

  getProfile: () => request('/profile'),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  submitOnboarding: (data) => request('/onboarding', { method: 'POST', body: JSON.stringify(data) }),

  getGoals: () => request('/goals'),
  createGoal: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),

  getProgress: () => request('/progress'),
  createProgress: (data) => request('/progress', { method: 'POST', body: JSON.stringify(data) }),
  deleteProgress: (id) => request(`/progress/${id}`, { method: 'DELETE' }),

  getPersonalRecords: () => request('/personal-records'),

  getWorkoutPlans: () => request('/workout-plans'),
  createWorkoutPlan: (data) => request('/workout-plans', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkoutPlan: (id, data) => request(`/workout-plans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteWorkoutPlan: (id) => request(`/workout-plans/${id}`, { method: 'DELETE' }),
  completeWorkoutPlan: (id, data) => request(`/workout-plans/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),
  previewWorkoutPlans: () => request('/workout-plans/preview', { method: 'POST' }),
  suggestWorkoutPlans: (plans) => request('/workout-plans/suggest', { method: 'POST', body: JSON.stringify(plans) }),


  getReminders: () => request('/reminders'),
  createReminder: (data) => request('/reminders', { method: 'POST', body: JSON.stringify(data) }),
  updateReminder: (id, data) => request(`/reminders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReminder: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),
};
