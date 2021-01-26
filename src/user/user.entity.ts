import { BaseEntity, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ type: "bigint" })
  id: number
}
