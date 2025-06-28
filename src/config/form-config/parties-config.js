export const partyFormConfig = [
  {
    name: 'party_name',
    label: 'Company Name',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'party_code',
    label: 'Party Code',
    type: 'text',
    hideInCreate: true,
    readonly: true,
  },
  {
    name: 'contact_person_name',
    label: 'Contact Person',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'party_role',
    label: 'Role',
    type: 'simple-select',
    options: [], // Will be fetched dynamically
    fetchOptions: 'getPartyRoles', // API endpoint to fetch roles
    debounceDelay: 300,
  },

  // Business Details Section
  {
    name: 'work_type',
    label: 'Work Type',
    type: 'simple-select',
    options: [], // Will be fetched dynamically
    fetchOptions: 'getWorkTypes',
    debounceDelay: 300,
  },
  {
    name: 'business_status',
    label: 'Business Status',
    type: 'simple-select',
    options: [], // Will be fetched dynamically
    fetchOptions: 'getBusinessStatuses',
    validation: { required: true },
    debounceDelay: 300,
  },
  {
    name: 'about_company',
    label: 'About Company',
    type: 'text-area',
  },
  {
    name: 'website',
    label: 'Website',
    type: 'text',
    validation: {
      pattern: { value: /^https?:\/\/.+\..+/, message: 'Enter a valid URL' },
    },
  },
  {
    name: 'business_type',
    label: 'Business Type',
    type: 'simple-select',
    options: [], // Will be fetched dynamically
    fetchOptions: 'getBusinessTypes',
    validation: { required: true },
    debounceDelay: 300,
  },
  {
    name: 'gst_no',
    label: 'GST Number',
    type: 'text',
    validation: {
      pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: 'Invalid GST format',
      },
    },
  },

  // Office Information Section (Conditional)
  {
    name: 'has_office',
    label: 'Has Physical Office?',
    type: 'toggle',
    defaultValue: true,
  },
  {
    name: 'office_type',
    label: 'Office Type',
    type: 'simple-select',
    options: [], // Will be fetched dynamically
    fetchOptions: 'getOfficeTypes',
    showIf: (values) => values?.has_office === true,
    validation: { required: true },
    debounceDelay: 300,
  },
  {
    name: 'how_old_is_office',
    label: 'Office Age',
    type: 'text',
    showIf: (values) => values?.has_office === true,
  },
  {
    name: 'office_address',
    label: 'Office Address',
    type: 'text-area',
    showIf: (values) => values?.has_office === true,
  },
  {
    name: 'office_google_location',
    label: 'Google Maps Link',
    type: 'text',
    showIf: (values) => values?.has_office === true,
    validation: {
      pattern: { value: /^https?:\/\/.+\..+/, message: 'Enter a valid URL' },
    },
  },

  // Contact Information
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    validation: {
      required: true,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address',
      },
    },
  },
  {
    name: 'contact_number',
    label: 'Contact Number',
    type: 'text',
    validation: {
      required: true,
      pattern: {
        value: /^[0-9]{10}$/,
        message: 'Must be 10 digits',
      },
    },
  },
  {
    name: 'mother_tongue',
    label: 'Mother Tongue',
    type: 'text',
  },

  // Location Details
  {
    name: 'country',
    label: 'Country',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'address_line_1',
    label: 'Address Line 1',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'address_line_2',
    label: 'Address Line 2',
    type: 'text',
    validation: { required: true },
  },
  {
    name: 'location',
    label: 'Location/Area',
    type: 'text',
  },
  {
    name: 'latitude',
    label: 'Latitude',
    type: 'text',
    step: '0.000001',
  },
  {
    name: 'longitude',
    label: 'Longitude',
    type: 'text',
    step: '0.000001',
  },

  {
    name: 'party_users',
    label: 'Team Members',
    type: 'dynamic-input-group',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'contact_number',
        label: 'Contact Number',
        type: 'text',
      },
      {
        name: 'role',
        label: 'Role',
        type: 'simple-select',
        options: [], // Will be fetched dynamically
        fetchOptions: 'getTeamMemberRoles',
        debounceDelay: 300,
      },
      {
        name: 'status',
        label: 'Active',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },

  // System Fields
  {
    name: 'status',
    label: 'Active',
    type: 'toggle',
    defaultValue: true,
  },
  {
    name: 'party_added_by_id',
    type: 'hidden',
    hideInCreate: true,
  },
];
