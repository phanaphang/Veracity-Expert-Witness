import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useProfile() {
  const { user, fetchProfile } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [specRes, eduRes, expRes, credRes] = await Promise.all([
      supabase.from('expert_specialties').select('specialty_id').eq('expert_id', user.id),
      supabase.from('education').select('*').eq('expert_id', user.id).order('end_year', { ascending: false }),
      supabase.from('work_experience').select('*').eq('expert_id', user.id).order('start_date', { ascending: false }),
      supabase.from('credentials').select('*').eq('expert_id', user.id).order('created_at', { ascending: false }),
    ]);

    setSpecialties(specRes.data?.map(s => s.specialty_id) || []);
    setEducation(eduRes.data || []);
    setExperience(expRes.data || []);
    setCredentials(credRes.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (!error) await fetchProfile(user.id);
    return { error };
  };

  const updateSpecialties = async (specialtyIds) => {
    await supabase.from('expert_specialties').delete().eq('expert_id', user.id);
    if (specialtyIds.length > 0) {
      await supabase.from('expert_specialties').insert(
        specialtyIds.map(id => ({ expert_id: user.id, specialty_id: id }))
      );
    }
    setSpecialties(specialtyIds);
  };

  return {
    specialties, education, experience, credentials,
    loading, updateProfile, updateSpecialties, reload: loadProfileData,
  };
}
