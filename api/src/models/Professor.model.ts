import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
  tableName: 'professors',
})
class Professor extends Model {
  @Column({
    type: DataType.STRING,
  })
  declare image: string

  @Column({
    type: DataType.STRING,
  })
  declare name: string

  @Column({
    type: DataType.STRING,
  })
  declare email: string
}

export default Professor
