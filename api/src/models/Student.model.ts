import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'students',
})
class Student extends Model {
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

  @Column({
    type: DataType.INTEGER,
  })
  declare age: number

  @Column({
    type: DataType.INTEGER,
  })
  declare career: number
}

export default Student
