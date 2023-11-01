import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CompanionService {
  constructor(@InjectModel('Companion') private readonly companionModel) {}
}
