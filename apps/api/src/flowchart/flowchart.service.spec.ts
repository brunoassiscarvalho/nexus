import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlowchartService } from './flowchart.service';
import { Flowchart, FlowchartDocument } from './flowchart.schema';
import { ExportFlowchartDto } from './dto/export-flowchart.dto';

// Mock Mongoose Model
const mockFlowchartModel = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
};

describe('FlowchartService', () => {
  let service: FlowchartService;
  let model: Model<FlowchartDocument>;

  beforeEach(async () => {
    // Reset mocks
    mockFlowchartModel.findOneAndUpdate.mockClear();
    mockFlowchartModel.findOne.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowchartService,
        {
          provide: getModelToken(Flowchart.name),
          useValue: mockFlowchartModel,
        },
      ],
    }).compile();

    service = module.get<FlowchartService>(FlowchartService);
    model = module.get<Model<FlowchartDocument>>(getModelToken(Flowchart.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportFlowchart', () => {
    it('should call findOneAndUpdate with correct parameters and return a flowchart', async () => {
      const userId = 'test-user';
      const data: ExportFlowchartDto = {
        cards: [{ id: '1', type: 'input', x: 0, y: 0, label: 'Start' }],
        connections: [],
        version: '1.0',
      };
      const expectedFlowchart = { userId, ...data };

      // Mock the findOneAndUpdate method to return the expected flowchart
      mockFlowchartModel.findOneAndUpdate.mockResolvedValue(expectedFlowchart);

      const result = await service.exportFlowchart(userId, data);

      // Verify that findOneAndUpdate was called with the correct arguments
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { userId },
        { ...data, userId },
        { upsert: true, new: true }
      );

      // Verify that the result matches the expected flowchart
      expect(result).toEqual(expectedFlowchart);
    });
  });

  describe('importFlowchart', () => {
    it('should call findOne with the correct userId and return the flowchart', async () => {
      const userId = 'test-user';
      const expectedFlowchart = {
        userId,
        cards: [],
        connections: [],
        version: '1.0'
      };

      // Mock the findOne method to return the expected flowchart
      mockFlowchartModel.findOne.mockResolvedValue(expectedFlowchart);

      const result = await service.importFlowchart(userId);

      // Verify that findOne was called with the correct userId
      expect(model.findOne).toHaveBeenCalledWith({ userId });

      // Verify that the result matches the expected flowchart
      expect(result).toEqual(expectedFlowchart);
    });

    it('should return null if no flowchart is found', async () => {
      const userId = 'non-existing-user';

      // Mock the findOne method to return null
      mockFlowchartModel.findOne.mockResolvedValue(null);

      const result = await service.importFlowchart(userId);

      // Verify that findOne was called
      expect(model.findOne).toHaveBeenCalledWith({ userId });

      // Verify that the result is null
      expect(result).toBeNull();
    });
  });
});