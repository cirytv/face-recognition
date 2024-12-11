import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'attendances',
})
class Attendance extends Model {
  @Column({
    type: DataType.INTEGER,
  })
  declare enrollment_id: number

  @Column({
    type: DataType.INTEGER,
  })
  declare schedule_id: number

  @Default(new Date('2025-01-01'))
  @Column({
    type: DataType.DATE,
  })
  declare date: Date

  @Column({
    type: DataType.TIME,
  })
  declare arrival_time: string // Hora de llegada

  @Column({
    type: DataType.TIME,
  })
  declare departure_time: string // Hora de salida
}

export default Attendance
