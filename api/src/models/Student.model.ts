import { Table, Column, Model, DataType, Default } from 'sequelize-typescript'

@Table({
  tableName: 'students',
})
class Student extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string
  @Column({
    type: DataType.INTEGER,
  })
  declare age: number
}

export default Student
