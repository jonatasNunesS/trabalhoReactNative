export const EXAMPLE_DATA = {
  shop: {
    name: "Barbearia Premium",
    logoUrl: "",
    primaryColor: "#1E40AF",
  },
  upcomingAppointments: [
    {
      id: "example-appointment-1",
      barberName: "Carlos Mendes",
      barberAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      serviceName: "Corte de Cabelo",
      dateTime: "2026-03-25T14:00:00",
    },
    {
      id: "example-appointment-2",
      barberName: "João Silva",
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
      image:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
      availableBarbers: [
        { id: "b1", name: "Carlos Mendes" },
        { id: "b2", name: "João Silva" },
      ],
    },
    {
      id: "example-service-2",
      name: "Barba Completa",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
      availableBarbers: [
        { id: "b2", name: "João Silva" },
        { id: "b3", name: "Rafael Costa" },
      ],
    },
  ],
};