import { 
    AfterUpdate, 
    AfterRemove, 
    AfterInsert, 
    Entity, 
    Column, 
    PrimaryGeneratedColumn 
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInser() {
        console.log('Insert User with Id: ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User with id: ', this.id);
    }

    @AfterRemove()
    remover() {
        console.log('Removed User with id: ', this.id);
    }
}