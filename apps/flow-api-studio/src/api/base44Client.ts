// Mock API client for base44 backend
// This is a placeholder implementation that simulates the API calls

import type { User, API, Endpoint, UseCase, TestData } from "../definitions";

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    full_name: "Editor User",
    email: "editor@example.com",
    persona: "editor",
  },
  {
    id: "2",
    full_name: "Viewer User",
    email: "viewer@example.com",
    persona: "visualizador",
  },
];

const mockAPIs: API[] = [
  {
    id: "1",
    name: "User Management API",
    description: "API for managing users",
    version: "1.0.0",
    base_url: "https://api.example.com/v1",
    created_date: "2024-01-01T00:00:00Z",
  },
];

const mockEndpoints: Endpoint[] = [
  {
    id: "1",
    api_id: "1",
    name: "Get Users",
    method: "GET",
    path: "/users",
    description: "Retrieve all users",
    request_params: [],
    response_params: [
      {
        name: "users",
        type: "array",
        description: "Array of user objects",
        required: true,
      },
    ],
  },
];

const mockUseCases: UseCase[] = [
  {
    id: "1",
    api_id: "1",
    name: "User Registration Flow",
    description: "Complete user registration process",
    created_date: "2024-01-01T00:00:00Z",
    flow: {
      nodes: [
        {
          id: "start",
          type: "start",
          position: { x: 100, y: 100 },
          data: { label: "Start" },
        },
        {
          id: "end",
          type: "end",
          position: { x: 500, y: 100 },
          data: { label: "End" },
        },
      ],
      edges: [],
    },
  },
];

const mockTestData: TestData[] = [
  {
    id: "1",
    endpoint_id: "1",
    name: "Sample User Data",
    data: { name: "John Doe", email: "john@example.com" },
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API client
export const base44 = {
  auth: {
    async me(): Promise<User> {
      await delay(500);
      // Return editor user by default for development
      return mockUsers[0];
    },

    async logout(): Promise<void> {
      await delay(200);
      console.log("Logged out");
    },
  },

  entities: {
    API: {
      async list(order?: string): Promise<API[]> {
        await delay(300);
        return [...mockAPIs].sort((a, b) => {
          if (order?.startsWith("-")) {
            return (
              new Date(b.created_date).getTime() -
              new Date(a.created_date).getTime()
            );
          }
          return (
            new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
          );
        });
      },

      async create(data: Omit<API, "id" | "created_date">): Promise<API> {
        await delay(300);
        const newAPI: API = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        mockAPIs.push(newAPI);
        return newAPI;
      },

      async update(id: string, data: Partial<API>): Promise<API> {
        await delay(300);
        const index = mockAPIs.findIndex((api) => api.id === id);
        if (index === -1) throw new Error("API not found");
        mockAPIs[index] = { ...mockAPIs[index], ...data };
        return mockAPIs[index];
      },

      async delete(id: string): Promise<void> {
        await delay(300);
        const index = mockAPIs.findIndex((api) => api.id === id);
        if (index === -1) throw new Error("API not found");
        mockAPIs.splice(index, 1);
      },

      async filter(filters: Partial<API>): Promise<API[]> {
        await delay(300);
        return mockAPIs.filter((api) =>
          Object.entries(filters).every(
            ([key, value]) => api[key as keyof API] === value
          )
        );
      },
    },

    Endpoint: {
      async list(): Promise<Endpoint[]> {
        await delay(300);
        return [...mockEndpoints];
      },

      async create(data: Omit<Endpoint, "id">): Promise<Endpoint> {
        await delay(300);
        const newEndpoint: Endpoint = {
          ...data,
          id: Date.now().toString(),
        };
        mockEndpoints.push(newEndpoint);
        return newEndpoint;
      },

      async update(id: string, data: Partial<Endpoint>): Promise<Endpoint> {
        await delay(300);
        const index = mockEndpoints.findIndex((endpoint) => endpoint.id === id);
        if (index === -1) throw new Error("Endpoint not found");
        mockEndpoints[index] = { ...mockEndpoints[index], ...data };
        return mockEndpoints[index];
      },

      async delete(id: string): Promise<void> {
        await delay(300);
        const index = mockEndpoints.findIndex((endpoint) => endpoint.id === id);
        if (index === -1) throw new Error("Endpoint not found");
        mockEndpoints.splice(index, 1);
      },

      async filter(filters: Partial<Endpoint>): Promise<Endpoint[]> {
        await delay(300);
        return mockEndpoints.filter((endpoint) =>
          Object.entries(filters).every(
            ([key, value]) => endpoint[key as keyof Endpoint] === value
          )
        );
      },
    },

    UseCase: {
      async list(order?: string): Promise<UseCase[]> {
        await delay(300);
        return [...mockUseCases].sort((a, b) => {
          if (order?.startsWith("-")) {
            return (
              new Date(b.created_date).getTime() -
              new Date(a.created_date).getTime()
            );
          }
          return (
            new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
          );
        });
      },

      async create(
        data: Omit<UseCase, "id" | "created_date">
      ): Promise<UseCase> {
        await delay(300);
        const newUseCase: UseCase = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        mockUseCases.push(newUseCase);
        return newUseCase;
      },

      async update(id: string, data: Partial<UseCase>): Promise<UseCase> {
        await delay(300);
        const index = mockUseCases.findIndex((useCase) => useCase.id === id);
        if (index === -1) throw new Error("UseCase not found");
        mockUseCases[index] = { ...mockUseCases[index], ...data };
        return mockUseCases[index];
      },

      async delete(id: string): Promise<void> {
        await delay(300);
        const index = mockUseCases.findIndex((useCase) => useCase.id === id);
        if (index === -1) throw new Error("UseCase not found");
        mockUseCases.splice(index, 1);
      },

      async filter(filters: Partial<UseCase>): Promise<UseCase[]> {
        await delay(300);
        return mockUseCases.filter((useCase) =>
          Object.entries(filters).every(
            ([key, value]) => useCase[key as keyof UseCase] === value
          )
        );
      },
    },

    TestData: {
      async list(): Promise<TestData[]> {
        await delay(300);
        return [...mockTestData];
      },

      async create(data: Omit<TestData, "id">): Promise<TestData> {
        await delay(300);
        const newTestData: TestData = {
          ...data,
          id: Date.now().toString(),
        };
        mockTestData.push(newTestData);
        return newTestData;
      },

      async update(id: string, data: Partial<TestData>): Promise<TestData> {
        await delay(300);
        const index = mockTestData.findIndex((testData) => testData.id === id);
        if (index === -1) throw new Error("TestData not found");
        mockTestData[index] = { ...mockTestData[index], ...data };
        return mockTestData[index];
      },

      async delete(id: string): Promise<void> {
        await delay(300);
        const index = mockTestData.findIndex((testData) => testData.id === id);
        if (index === -1) throw new Error("TestData not found");
        mockTestData.splice(index, 1);
      },

      async filter(filters: Partial<TestData>): Promise<TestData[]> {
        await delay(300);
        return mockTestData.filter((testData) =>
          Object.entries(filters).every(
            ([key, value]) => testData[key as keyof TestData] === value
          )
        );
      },
    },
  },
};
