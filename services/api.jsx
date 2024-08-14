import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bookings API

export const createBooking = async (bookingData, token) => {
  try {
    const response = await api.post('/bookings', bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBooking = async (id, token) => {
  try {
    const response = await api.get(`/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const changeBookingStatus = async (id, statusData, token) => {
  try {
    const response = await api.patch(`/bookings/${id}/status`, statusData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing booking status:', error);
    throw error;
  }
};

export const deleteBooking = async (id, token) => {
  try {
    const response = await api.delete(`/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const resolveConflict = async (conflictData, token) => {
  try {
    const response = await api.patch(`/bookings/conflict`, conflictData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error resolving conflict:', error);
    throw error;
  }
};

// Rooms API

export const createRoom = async (roomData, token) => {
  try {
    const response = await api.post('/rooms', roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const getRooms = async () => {
  try {
    const response = await api.get('/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const getRoom = async (number) => {
  try {
    const response = await api.get(`/rooms/${number}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};

export const updateRoom = async (roomData, token) => {
  try {
    const response = await api.put('/rooms', roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

export const deleteRoom = async (number, token) => {
  try {
    const response = await api.delete(`/rooms/${number}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};
