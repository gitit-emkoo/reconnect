import axiosInstance from './axios';
import { Content } from '../types/content';

export const fetchContents = async (): Promise<Content[]> => {
  try {
    const response = await axiosInstance.get('/content');
    return response.data;
  } catch (error) {
    console.error('Error fetching contents:', error);
    throw error;
  }
};

export const fetchContentById = async (id: string): Promise<Content> => {
  try {
    const response = await axiosInstance.get(`/content/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content with id ${id}:`, error);
    throw error;
  }
};

export const createContent = async (contentData: Partial<Content>): Promise<Content> => {
  try {
    const response = await axiosInstance.post('/content', contentData);
    return response.data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

export const updateContent = async (id: string, contentData: Partial<Content>): Promise<Content> => {
  try {
    const response = await axiosInstance.patch(`/content/${id}`, contentData);
    return response.data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

export const deleteContent = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/content/${id}`);
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};

export const likeContent = async (id: string): Promise<void> => {
  try {
    await axiosInstance.post(`/content/${id}/like`);
  } catch (error) {
    console.error('Error liking content:', error);
    throw error;
  }
};

export const unlikeContent = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/content/${id}/like`);
  } catch (error) {
    console.error('Error unliking content:', error);
    throw error;
  }
};

export const bookmarkContent = async (id: string): Promise<void> => {
  try {
    await axiosInstance.post(`/content/${id}/bookmark`);
  } catch (error) {
    console.error('Error bookmarking content:', error);
    throw error;
  }
};

export const unbookmarkContent = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/content/${id}/bookmark`);
  } catch (error) {
    console.error('Error unbookmarking content:', error);
    throw error;
  }
};

export const fetchBookmarkedContents = async (): Promise<Content[]> => {
  try {
    const response = await axiosInstance.get('/content/bookmarked');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarked contents:', error);
    throw error;
  }
}; 