import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
  tableName: 'attendances',
})
class Attendance extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number

  @Column({
    type: DataType.INTEGER,
  })
  declare enrollment_id: number

  @Column({
    type: DataType.INTEGER,
  })
  declare schedule_id: number

  @Column({
    type: DataType.STRING,
  })
  declare status: string // Hora de llegada
}

export default Attendance
