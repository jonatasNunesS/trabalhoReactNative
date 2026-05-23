import {
  exampleHomeData,
  exampleProfessionalsData,
  exampleSlotsByProfessional,
} from '../data/exampleData';

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSchedulingPageData() {
  await wait();
  return JSON.parse(JSON.stringify(exampleHomeData));
}

export async function getProfessionalsPageData(serviceId) {
  await wait();
  const service = exampleHomeData.popularServices.find((item) => item.id === serviceId);

  return {
    serviceName: service?.name || 'Serviço',
    currentStep: exampleProfessionalsData.currentStep,
    totalSteps: exampleProfessionalsData.totalSteps,
    professionals: Array.isArray(service?.availableBarbers) ? service.availableBarbers : [],
  };
}

export async function getDateTimePageData({ serviceId, professionalId }) {
  await wait();
  const service = exampleHomeData.popularServices.find((item) => item.id === serviceId);

  const professional = exampleHomeData.popularServices
    .flatMap((item) => item.availableBarbers || [])
    .find((barber) => barber.id === professionalId);

  const availability = exampleSlotsByProfessional[professionalId] || {
    dates: [],
    timeSlots: {},
  };

  return {
    service: service || null,
    professional: professional || null,
    dates: availability.dates,
    timeSlots: availability.timeSlots,
    currentStep: 3,
    totalSteps: 4,
  };
}
