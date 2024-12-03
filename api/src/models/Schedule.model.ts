import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'schedules',
})
class Schedule extends Model {
  @Column({
    type: DataType.STRING,
  })
  declare name: string

  @Column({
    type: DataType.STRING,
  })
  declare description: string

  @Column({
    type: DataType.INTEGER,
  })
  declare course_id: number

  @Column({
    type: DataType.INTEGER,
  })
  declare professor_id: number

  @Column({
    type: DataType.STRING,
  })
  declare day_of_week: string

  @Column({
    type: DataType.DATE,
  })
  declare start_time: Date

  @Column({
    type: DataType.DATE,
  })
  declare end_time: Date
}

export default Schedule
