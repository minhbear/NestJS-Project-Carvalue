import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor( 
        @InjectRepository(Report) private repo: Repository<Report>
    ){}

    createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year })
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne()
    }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id)} });
        if(!report){
            throw new NotFoundException('Report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }
}
// {
//     make: 'ford',
//     model: 'mustang',
//     year: 1982,
//     mileage: 50000,
//     lng: 45,
//     lat: 45,
//     price: 200000,
//     user: {
//       id: 1,
//       email: 'hvmnhatminh@gmail.com',
//       password: 'Minh0914121791',
//       admin: false
//     }
//   }