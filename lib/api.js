import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/leo';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where Zustand persists it)
    if (typeof window !== 'undefined') {
      try {
        const storage = localStorage.getItem('leoverse-storage');
        if (storage) {
          const { state } = JSON.parse(storage);
          if (state?.authToken) {
            config.headers.Authorization = `Bearer ${state.authToken}`;
          }
        }
      } catch (error) {
        console.error('Error reading auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mission APIs
export const missionAPI = {
  create: (data) => apiClient.post('/api/missions/create.php', data),
  addComponent: (data) => apiClient.post('/api/missions/add_component.php', data),
  complete: (data) => apiClient.post('/api/missions/complete.php', data),
  getUserMissions: (userId) => apiClient.get(`/api/missions/get_user_missions.php?user_id=${userId}`),
  getMissionDetails: (missionId) => apiClient.get(`/api/missions/get_mission_details.php?mission_id=${missionId}`),
};

// Chat APIs
export const chatAPI = {
  createSession: (data) => apiClient.post('/api/chat/create_session.php', data),
  updateContext: (data) => apiClient.post('/api/chat/update_context.php', data),
};

// Progress APIs
export const progressAPI = {
  update: (data) => apiClient.post('/api/progress/update.php', data),
  get: (userId) => apiClient.get(`/api/progress/get.php?user_id=${userId}`),
};

// Achievement APIs
export const achievementAPI = {
  award: (data) => apiClient.post('/api/achievements/award.php', data),
  getUserAchievements: (userId) => apiClient.get(`/api/achievements/get_user_achievements.php?user_id=${userId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  get: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.country) queryParams.append('country', params.country);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    return apiClient.get(`/api/leaderboard/get.php?${queryParams.toString()}`);
  },
  add: (data) => apiClient.post('/api/leaderboard/add.php', data),
  update: (data) => apiClient.post('/api/leaderboard/update.php', data),
  crisis: (data) => apiClient.post('/api/leaderboard/crisis.php', data),
};

// Auth APIs
export const authAPI = {
  login: (data) => apiClient.post('/api/auth/login.php', data),
  signup: (data) => apiClient.post('/api/auth/signup.php', data),
  verify: (data) => apiClient.post('/api/auth/verify.php', data),
};

export default apiClient;
