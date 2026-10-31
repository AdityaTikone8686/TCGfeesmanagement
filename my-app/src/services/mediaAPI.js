const API_BASE_URL =
  "https://tikonecricketgurukulbackend.onrender.com/api";

export const mediaAPI = {
  // Fetch all uploaded media
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/media`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch media");
    }

    return data.media || [];
  },

  // Upload image or video
  upload: async (formData, token) => {
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Media upload failed");
    }

    return data;
  },

  // Delete media
  delete: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Media deletion failed");
    }

    return data;
  },
};
