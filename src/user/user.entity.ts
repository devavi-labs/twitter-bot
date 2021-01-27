import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: "text" })
  id: string

  @Column({ nullable: true })
  followers: string
}
