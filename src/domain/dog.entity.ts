
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    personality: string;

    @Column()
    breed: string;
}



