export const mapEmployeeDataToForm = (data) => {
  if (!data) return {};

  return {
    ...data,
    date_of_birth: data.date_of_birth ? data.date_of_birth.slice(0, 10) : '',
    superior_id: data.superior?.id || null,
    party_ids: data.parties?.map((party) => party.id) || [],
    employee_group_ids: data.groups?.map((group) => group.id) || [],
  };
};

export const mapActivityOutcomeDataToForm = (data) => {
  if (!data) return {};

  return {
    ...data,
    outcomes: data.outcomes?.map((outcome) => outcome.name) || [''],
    activity_type_ids: data.types?.map((type) => type.id) || [],
  };
};

export const mapActivityDataToForm = (data) => {
  if (!data) return {};

  return {
    ...data,
    assigned_to_id: data.assigned_to?.id || '',
    party_id: data.party?.id || '',
    activity_type_id: data.activity_type?.id || '',
    activity_priority_id: data.activity_priority?.id || '',
    date: data.date || '',
    time: data.time ? data.time.substring(0, 5) : '',
    activity_outcome_id: data.activity_outcome?.id || '',
    outcome_submitted_at: data.outcome_submitted_at || '',
  };
};
