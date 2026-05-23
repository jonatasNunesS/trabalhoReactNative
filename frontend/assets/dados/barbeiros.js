export const EXAMPLE_DATA = {
  shop: {
    name: "Barbearia Premium",
    logoUrl: "",
    primaryColor: "#1E40AF",
  },
  upcomingAppointments: [
    {
      id: "example-appointment-1",
      barberName: "Carlos Souza",
      barberAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      serviceName: "Corte de Cabelo",
      dateTime: "2026-03-25T14:00:00",
    },
    {
      id: "example-appointment-2",
      barberName: "Felipe Martins",
      barberAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      serviceName: "Barba Completa",
      dateTime: "2026-03-25T15:30:00",
    },
  ],
  popularServices: [
    {
      id: "example-service-1",
      name: "Corte de Cabelo",
      price: 50,
      durationMinutes: 45,
      image:
        "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
      availableBarbers: [
        {
          id: 1,
          name: "Carlos Souza",
          specialty: "Especialista em Corte",
          rating: 4.9,
          photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: 2,
          name: "Felipe Martins",
          specialty: "Especialista em Corte",
          rating: 4.8,
          photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        {
          id: 3,
          name: "André Lima",
          specialty: "Especialista em Corte e acabamento",
          rating: 4.7,
          photoUrl: "https://randomuser.me/api/portraits/men/52.jpg",
        },
      ],
    },
    {
      id: "example-service-2",
      name: "Barba Completa",
      price: 40,
      durationMinutes: 30,
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
      availableBarbers: [
        {
          id: 1,
          name: "Carlos Souza",
          specialty: "Especialista em Barba",
          rating: 4.9,
          photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: 3,
          name: "André Lima",
          specialty: "Especialista em Barba",
          rating: 4.7,
          photoUrl: "https://randomuser.me/api/portraits/men/52.jpg",
        },
      ],
    },
    {
      id: "example-service-3",
      name: "Corte + Barba",
      price: 80,
      durationMinutes: 70,
      image:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
      availableBarbers: [
        {
          id: 1,
          name: "Carlos Souza",
          specialty: "Especialista em Corte e Barba",
          rating: 4.9,
          photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          id: 3,
          name: "André Lima",
          specialty: "Especialista em Corte e Barba",
          rating: 4.7,
          photoUrl: "https://randomuser.me/api/portraits/men/52.jpg",
        },
      ],
    },
    {
      id: "example-service-4",
      name: "Sobrancelha",
      price: 30,
      durationMinutes: 20,
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
      availableBarbers: [
        {
          id: 2,
          name: "Felipe Martins",
          specialty: "Acabamento e sobrancelha",
          rating: 4.8,
          photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
        },
      ],
    },
  ],
};
