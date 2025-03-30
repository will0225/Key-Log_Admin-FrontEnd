import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Item } from '../auth/authService';
import { format } from 'date-fns';
import Pager from './Pager';

type DynamicData = { [key: string]: any };

interface IPaginationTable {
    data: Array<DynamicData>;
    rowsPerPage: number;
    totalPages: number;
    currentPage: number;
    columns: Array<string>;
    goToPage: (currentPage: number) => void;
    isDelete?: boolean;
    handleDelete?: (id: number) => void;
}

const PaginationTable = (props: IPaginationTable) => {

    const { data, rowsPerPage, totalPages, currentPage, goToPage, columns, isDelete = false, handleDelete = () => {} } = props;

    return (
      <div>
        {/* Table displaying the data */}
        {/* Pagination controls */}

        <Table responsive="md">
            <thead>
                <tr>
                    <th>#</th>
                    { columns && columns.map((column, i) => (
                        <th key={i}>{column}</th>
                    ))}
                    {isDelete &&
                        <th></th>
                    }
                </tr>
            </thead>
            <tbody>
            {data && data.map((log: DynamicData, index) => (
                <tr key={log.id}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  
                    { columns && columns.map((column, i) => {
                        if(column === "date"){
                            return (
                                <td key={i}>{format(new Date(log[column]), 'yyyy-MM-dd')}</td>
                            ) 
                        } else if(column === "time")
                        {
                            return (
                                <td key={i}>{format(new Date(Number(log[column])), 'HH:mm:ss')}</td>
                            )
                        } else {
                            return (
                                <td key={i}>{log[column]}</td>
                            )
                        }
                    })}
                    {isDelete &&
                    <td>
                    <svg onClick={() => handleDelete(log.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                    </td>
                    }
                </tr>
            ))}
            </tbody>
        </Table>
        <Pager currentPage={currentPage} totalPages={totalPages} goToPage={goToPage}/>
      </div>
    );
};

export default PaginationTable;
  