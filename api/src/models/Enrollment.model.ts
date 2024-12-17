import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'enrollments',
})
class Enrollment extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number

  @Column({
    type: DataType.INTEGER,
  })
  declare student_id: number

  @Column({
    type: DataType.INTEGER,
  })
  declare course_id: number

  @Default(new Date('2025-01-01'))
  @Column({
    type: DataType.DATE,
  })
  declare enrollment_date: Date
}

export default Enrollment
