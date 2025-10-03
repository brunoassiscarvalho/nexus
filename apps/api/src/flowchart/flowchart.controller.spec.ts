import { Test, TestingModule } from '@nestjs/testing';
import { FlowchartController } from './flowchart.controller';
import { FlowchartService } from './flowchart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportFlowchartDto } from './dto/export-flowchart.dto';

// Mock FlowchartService
const mockFlowchartService = {
  exportFlowchart: jest.fn(),
  importFlowchart: jest.fn(),
};

describe('FlowchartController', () => {
  let controller: FlowchartController;
  let service: FlowchartService;

  beforeEach(async () => {
    // Reset mocks before each test
    mockFlowchartService.exportFlowchart.mockClear();
    mockFlowchartService.importFlowchart.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowchartController],
      providers: [
        {
          provide: FlowchartService,
          useValue: mockFlowchartService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock the guard to bypass authentication for unit tests
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FlowchartController>(FlowchartController);
    service = module.get<FlowchartService>(FlowchartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('export', () => {
    it('should call exportFlowchart service method with correct parameters', async () => {
      const userId = 'test-user-id';
      const data: ExportFlowchartDto = {
        cards: [],
        connections: [],
        version: '1.0',
      };

      // Mock the service's return value for this test
      mockFlowchartService.exportFlowchart.mockResolvedValueOnce({ success: true });

      await controller.export(userId, data);

      // Verify that the service method was called with the correct arguments
      expect(service.exportFlowchart).toHaveBeenCalledWith(userId, data);
    });
  });

  describe('import', () => {
    it('should return flowchart data if a flowchart is found', async () => {
      const userId = 'test-user-id';
      const flowchartData = {
        _id: 'some-id',
        userId: userId,
        cards: [{ id: 'card1', type: 'custom', position: { x: 0, y: 0 }, data: {} }],
        connections: [{ id: 'conn1', source: 'card1', target: 'card2' }],
        version: '1.0',
      };

      // Mock the service to return the flowchart data
      mockFlowchartService.importFlowchart.mockResolvedValueOnce(flowchartData);

      const result = await controller.import(userId);

      // Verify that the service method was called
      expect(service.importFlowchart).toHaveBeenCalledWith(userId);

      // Verify that the controller returns the correct data structure
      expect(result).toEqual({
        cards: flowchartData.cards,
        connections: flowchartData.connections,
        version: flowchartData.version,
      });
    });

    it('should return a default structure if no flowchart is found', async () => {
      const userId = 'test-user-id';

      // Mock the service to return null, simulating no flowchart found
      mockFlowchartService.importFlowchart.mockResolvedValueOnce(null);

      const result = await controller.import(userId);

      // Verify that the service method was called
      expect(service.importFlowchart).toHaveBeenCalledWith(userId);

      // Verify that the controller returns the default empty structure
      expect(result).toEqual({
        cards: [],
        connections: [],
        version: '1.0',
      });
    });
  });
});