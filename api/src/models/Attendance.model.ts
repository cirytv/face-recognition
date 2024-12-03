import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'attendances',
})
class Attendance extends Model {
  @Column({
    type: DataType.STRING,
  })
  declare enrollment_id: string

  @Default(new Date('2025-01-01'))
  @Column({
    type: DataType.DATE,
  })
  declare date: Date

  @Column({
    type: DataType.STRING,
  })
  declare status: string
}

export default Attendance
