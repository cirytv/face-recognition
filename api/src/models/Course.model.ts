import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
  tableName: 'courses',
})
class Course extends Model {
  @Column({
    type: DataType.STRING,
  })
  declare name: string

  @Column({
    type: DataType.STRING,
  })
  declare description: string
}

export default Course
