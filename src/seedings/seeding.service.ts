import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { posts } from '../../data-seeding';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { Seeding } from './entities/seeding.entity';

@Injectable()
export class SeedingService {
  private readonly seedingId = 'initial-seeding';
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async seed(): Promise<void> {
    if (!(await this.entityManager.findOne(Seeding, { id: this.seedingId }))) {
      await this.entityManager.transaction(
        async (transcationalEntityManager) => {
          await Promise.all([
            await Promise.all(
              posts.map(async (post) => {
                transcationalEntityManager.save(PostEntity, post);
              }),
            ),
            // Add more seeding entities here...
          ]);
          // persist in db that 'initial-seeding' is complete
          await transcationalEntityManager.save(new Seeding(this.seedingId));
          console.log('Seeding complete...');
        },
      );
    } else {
      console.log('Already have seeding data...');
    }
  }
}
