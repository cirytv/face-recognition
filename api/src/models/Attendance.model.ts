import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'attendance',
})
class Attendance extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare student_id: string

  @Default(new Date('2025-01-01'))
  @Column({
    type: DataType.DATE,
  })
  declare attendance_date: Date
}

export default Attendance
