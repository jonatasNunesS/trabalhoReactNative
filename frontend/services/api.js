import {
  getSchedulingPageData as getMockSchedulingPageData,
  getProfessionalsPageData as getMockProfessionalsPageData,
  getDateTimePageData as getMockDateTimePageData,
} from './mockApi';

const USE_REMOTE_API = false;
const API_BASE_URL = 'http://SEU_IP_OU_DOMINIO:3000';

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json();
}

export async function getSchedulingPageData() {
  if (!USE_REMOTE_API) {
    return getMockSchedulingPageData();
  }

  try {
    return await request('/scheduling-page');
  } catch (error) {
    return getMockSchedulingPageData();
  }
}

export async function getProfessionalsPageData(serviceId) {
  if (!USE_REMOTE_API) {
    return getMockProfessionalsPageData(serviceId);
  }

  try {
    return await request(`/professionals-page?serviceId=${serviceId}`);
  } catch (error) {
    return getMockProfessionalsPageData(serviceId);
  }
}

export async function getDateTimePageData({ serviceId, professionalId }) {
  if (!USE_REMOTE_API) {
    return getMockDateTimePageData({ serviceId, professionalId });
  }

  try {
    return await request(
      `/date-time-page?serviceId=${serviceId}&professionalId=${professionalId}`
    );
  } catch (error) {
    return getMockDateTimePageData({ serviceId, professionalId });
  }
}

export { API_BASE_URL, USE_REMOTE_API };
