import {
  AdminInterlockRequest,
  InterlockRequest,
  InterlockResponse,
  InterlockUserError,
  InterlockUserSession,
} from "@/interface";

const BASE_URL = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

const fetchInterlockByLot = async (lot: string): Promise<InterlockResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/interlock?lot=${lot}`, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar Interlocks por lote");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Erro ao buscar Interlocks por lote: " + error.message);
  }
};

export const fetchDetailsSerialNumber = async (
  lot: string,
  serialNumber: string
): Promise<InterlockResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/interlock/detailsSerialNumber?lot=${lot}&sn=${serialNumber}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar Interlocks por lote");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Erro ao buscar Interlocks por lote: " + error.message);
  }
};

export const fetchInterlockAccess = async (
  matricula: string,
  password: string
): Promise<InterlockUserSession> => {
  try {
    const response = await fetch(
      `${BASE_URL}/interlock/access?mat=${matricula}&pass=${password}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar acesso interlock");
    }

    const data: InterlockUserSession | InterlockUserError =
      await response.json();

    if (
      Object.hasOwn(data, "status") &&
      (data as InterlockUserError)?.status === 400
    ) {
      throw new Error((data as InterlockUserError).message);
    }
    return data as InterlockUserSession;
  } catch (error: any) {
    throw new Error("Erro ao buscar acesso interlock: " + error.message);
  }
};

export const fetchInterlockAccessAdmAndCloseLot = async (
  matricula: string,
  password: string,
  lote: string
): Promise<InterlockUserSession> => {
  try {
    const response = await fetch(
      `${BASE_URL}/interlock/adm-access?mat=${matricula}&pass=${password}&lot=${lote}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao validar Adm");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error("Erro ao validar Adm: " + error.message);
  }
};

const validateInterlock = async (
  interlockData: InterlockRequest
): Promise<InterlockResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/interlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interlockData),
    });

    if (!response.ok) {
      throw new Error("Erro ao validar Interlock");
    }

    const data: InterlockResponse = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Erro ao validar Interlock: " + error.message);
  }
};

export const validateAdminInterlock = async (
  adminInterlockData: AdminInterlockRequest
): Promise<InterlockResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/interlock/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminInterlockData),
    });

    if (!response.ok) {
      throw new Error("Erro ao validar Adm");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error("Erro ao validar Adm: " + error.message);
  }
};

export { fetchInterlockByLot, validateInterlock };
