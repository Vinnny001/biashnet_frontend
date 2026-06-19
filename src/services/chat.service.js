import api from "./api";

export const chatService = {
  threads(params = {}) {
    return api.get("/chat", { params });
  },

  messages(threadId) {
    return api.get(`/chat/${threadId}/messages`);
  },

  send(threadId, payload) {
    return api.post(`/chat/${threadId}/messages`, payload);
  },

  create(payload) {
    return api.post("/chat", payload);
  }
};
