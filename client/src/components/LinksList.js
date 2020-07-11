import React from "react";

export const LinksList = ({ links }) => {
  if (!links.length) return <p className='center'>No links yet</p>

  return (
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Original link</th>
        <th>New link</th>
        <th>Date of creation</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      { links.map((link, index) => {
        return (
          <tr key={ link._id }>
            <td>{ index + 1 }</td>
            <td>{ link.from }</td>
            <td>{ link.to }</td>
            <td>{ new Date(link.date).toLocaleString() }</td>
            <td>
              <a href={ link.to } target="_blank" rel="noopener noreferrer">Open</a>
            </td>
          </tr>
        )
      }) }
      </tbody>
    </table>
  )
}