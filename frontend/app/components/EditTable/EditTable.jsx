import React from 'react'
import { Table } from 'react-bootstrap'
import Styles from './EditTable.module.css'

export const EditTable = ({ data, paramsTable, handleFunction }) => {
  return (
    <>
      <div className={Styles['edittable__container']}>
        <h1 className={Styles["edittable__title"]}>{paramsTable.name}</h1>
        <Table striped bordered hover variant="white">
          <thead>
            <tr>
              {paramsTable.columns.map((item, idx) => {
                return (
                  <th key={idx}>{item}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>

            {data && data.sort((a, b) => a - b).map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{idx+1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td className={Styles["edittable__changer"]} onClick={() => {handleFunction(item.actionType, item._id, item.array)}}>{item.action}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </>
  )
}
