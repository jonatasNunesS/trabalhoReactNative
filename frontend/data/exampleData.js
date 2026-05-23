export const developerBrand = {
  name: 'Sua Empresa',
  tagline: 'Tecnologia para barbearias',
};

export const exampleHomeData = {
  shop: {
    name: 'Barbearia Premium',
    logoUrl: '',
    primaryColor: '#163B9D',
    accentColor: '#22B8B0',
  },
  upcomingAppointments: [
    {
      id: 'appointment-1',
      barberName: 'Carlos Mendes',
      barberAvatar: '',
      serviceName: 'Corte de Cabelo',
      dateTime: '2026-05-25T14:00:00',
      status: 'Confirmado',
    },
    {
      id: 'appointment-2',
      barberName: 'João Silva',
      barberAvatar: '',
      serviceName: 'Barba Completa',
      dateTime: '2026-05-26T16:30:00',
      status: 'Pendente',
    },
  ],
  popularServices: [
    {
      id: 'service-1',
      name: 'Corte de Cabelo',
      price: 50,
      image: '',
      durationMinutes: 45,
      availableBarbers: [
        { id: 'barber-1', name: 'Carlos Mendes', specialty: 'Corte e acabamento', rating: 4.9, photoUrl: '' },
        { id: 'barber-2', name: 'João Silva', specialty: 'Fade e social', rating: 4.8, photoUrl: '' },
      ],
    },
    {
      id: 'service-2',
      name: 'Barba Completa',
      price: 40,
      image: '',
      durationMinutes: 30,
      availableBarbers: [
        { id: 'barber-3', name: 'Rafael Costa', specialty: 'Barba e visagismo', rating: 4.9, photoUrl: '' },
      ],
    },
    {
      id: 'service-3',
      name: 'Corte + Barba',
      price: 80,
      image: '',
      durationMinutes: 70,
      availableBarbers: [
        { id: 'barber-1', name: 'Carlos Mendes', specialty: 'Corte e acabamento', rating: 4.9, photoUrl: '' },
        { id: 'barber-3', name: 'Rafael Costa', specialty: 'Barba e visagismo', rating: 4.9, photoUrl: '' },
      ],
    },
    {
      id: 'service-4',
      name: 'Sobrancelha',
      price: 25,
      image: '',
      durationMinutes: 20,
      availableBarbers: [],
    },
  ],
};

export const exampleProfessionalsData = {
  currentStep: 2,
  totalSteps: 4,
};

export const exampleSlotsByProfessional = {
  'barber-1': {
    dates: [
      { id: '2026-05-27', label: '27/05' },
      { id: '2026-05-28', label: '28/05' },
      { id: '2026-05-29', label: '29/05' },
    ],
    timeSlots: {
      '2026-05-27': ['09:00', '10:00', '14:00', '16:00'],
      '2026-05-28': ['11:00', '13:00', '15:00'],
      '2026-05-29': ['08:30', '10:30', '17:00'],
    },
  },
  'barber-2': {
    dates: [
      { id: '2026-05-27', label: '27/05' },
      { id: '2026-05-30', label: '30/05' },
      { id: '2026-05-31', label: '31/05' },
    ],
    timeSlots: {
      '2026-05-27': ['08:00', '09:30', '11:00'],
      '2026-05-30': ['13:00', '15:00', '18:00'],
      '2026-05-31': ['10:00', '14:00'],
    },
  },
  'barber-3': {
    dates: [
      { id: '2026-05-26', label: '26/05' },
      { id: '2026-05-27', label: '27/05' },
      { id: '2026-05-28', label: '28/05' },
    ],
    timeSlots: {
      '2026-05-26': ['09:00', '11:00', '16:30'],
      '2026-05-27': ['10:00', '13:00', '17:30'],
      '2026-05-28': ['08:30', '12:00', '15:30'],
    },
  },
};
