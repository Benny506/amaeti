import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export const SUPABASE_URL = 'https://dobroapvyfllagbecnss.supabase.co';
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnJvYXB2eWZsbGFnYmVjbnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjQzODYsImV4cCI6MjA5NTQ0MDM4Nn0.xj4wJHQrFH2fcFppCO3iAZLd7RO4YrvbH-EsYAu8Q9g"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_STORAGE_URL = SUPABASE_URL + '/storage/v1/object/public/';

export const resolveImageUrl = (pathOrUrl, bucket = 'product_images') => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(pathOrUrl);
  return data.publicUrl;
};

export const invokeEdgeFunction = async (functionName, payload) => {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/functions/v1/${functionName}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error invoking edge function ${functionName}:`, error);
    return { data: null, error: error.response?.data || error.message };
  }
};
