import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
  tableName: 'careers',
})
class Career extends Model {
  @Column({
    type: DataType.STRING,
  })
  declare name: string

  @Column({
    type: DataType.STRING,
  })
  declare description: string
}

export default Career
