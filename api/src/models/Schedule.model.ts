import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'schedules',
})
class Schedule extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number

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
    type: DataType.DATE,
  })
  declare day_of_week: Date // Ahora es de tipo Date para representar la fecha de la clase

  @Column({
    type: DataType.TIME,
  })
  declare start_time: string

  @Column({
    type: DataType.TIME,
  })
  declare end_time: string
}

export default Schedule
