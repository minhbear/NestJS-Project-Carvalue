import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportRpository: Repository<Report>;

  const REPORT_REPOSITORY_TOKEN = getRepositoryToken(Report)
  //findOne, save, create, create query builder
  const mockCreate = (x: CreateReportDto): Report => {
    return { ...x, approved: false } as Report
  }
  const mockSave = (x: any): Promise<any> => {
    return Promise.resolve(x);
  }
  const mockFindOne = (id: string) => {
    const report = {
      make: 'ford',
      model: 'mustang',
      year: 1982,
      mileage: 50000,
      lng: 45,
      lat: 45,
      price: 200000,
      approved: false,
      user: {
        id: 1,
        email: 'hvmnhatminh@gmail.com',
        password: 'Minh0914121791',
        admin: false
      },
      id: 1
    }
    return Promise.resolve(report)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: REPORT_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(mockCreate),
            save: jest.fn(mockSave),
            findOne: jest.fn(mockFindOne)
          }
        }
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    reportRpository = module.get<Repository<Report>>(REPORT_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('report repository should be defined', () => {
    expect(reportRpository).toBeDefined();
  })

  it('can create a report', async () => {
    const reportDTo: CreateReportDto = {
      "make": "ford",
      "model": "mustang",
      "year": 1982,
      "mileage": 50000,
      "lng": 45,
      "lat": 45,
      "price": 200000
    }
    const user = {
      id: 1,
      email: 'hvmnhatminh@gmail.com',
      password: 'Minh0914121791',
      admin: false,
    } as User

    const reportRes = await service.create(reportDTo, user);
    expect(reportRes).toBeDefined();
    expect(reportRes.user).toEqual(user)
  });

  it('Can change approved of report', async () => {
    const reportRes = await service.changeApproval("1", true);
    expect(reportRes).toBeDefined();
    expect(reportRes.approved).toEqual(true)
  })
});
