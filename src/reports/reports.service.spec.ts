import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportRpository: Repository<Report>;

  const REPORT_REPOSITORY_TOKEN = getRepositoryToken(Report)
  //findOne, save, create, create query builder

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReportsService,
          {
            provide: REPORT_REPOSITORY_TOKEN,
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn()
            }
          }
        ],
      }).compile();

      service = module.get<ReportsService>(ReportsService);
      reportRpository = module.get< Repository<Report> >(REPORT_REPOSITORY_TOKEN);
    });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('report repository should be defined', () => {
    expect(reportRpository).toBeDefined();
  })
});
