import React, { useState } from "react";
import { TableWrapper } from "../table/styles";

const TableHeader = ({
    headers,
    onSortColumnChange,
    sortColumn,
    sortDirection,
}) => {
    const handleHeaderClick = (column) => {
        onSortColumnChange(column);
    };

    return (
        <thead>
            <tr>
                {headers.map((header) => (
                    <th key={header.column} onClick={() => handleHeaderClick(header.column)}>
                        {header.label}{" "}
                        {sortColumn === header.column && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

const TableBody = ({
    headers,
    data,
    currentPage,
    itemsPerPage,
    sortColumn,
    sortDirection,
    isLoading,
}) => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        const columnA = a[sortColumn];
        const columnB = b[sortColumn];

        if (columnA < columnB) return sortDirection === "asc" ? -1 : 1;
        if (columnA > columnB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // Paginate
    const paginatedData = sortedData.slice(startIdx, endIdx);

    return (
        <tbody>
            {!isLoading &&
                paginatedData.map((item) => (
                    <tr key={item.ActiveDirectoryId}>
                        {headers.map((header) => (
                            <td key={header.column}>{item[header.column]}</td>
                        ))}
                    </tr>
                ))}
        </tbody>
    );
};

const Pagination = ({
    currentPage,
    totalNumberOfPages,
    handlePageChange,
    maxPageNumbers = 5,
}) => {
    const pageNumbers = Array.from({ length: totalNumberOfPages }, (_, i) => i + 1);

    const renderPageNumbers = () => {
        if (totalNumberOfPages <= maxPageNumbers) {
            return pageNumbers;
        }

        const middleIndex = Math.floor(maxPageNumbers / 2);

        if (currentPage <= middleIndex) {
            // Display pages from 1 to maxPageNumbers
            return [
                ...pageNumbers.slice(0, maxPageNumbers - 1),
                "...",
                totalNumberOfPages,
            ];
        } else if (currentPage >= totalNumberOfPages - middleIndex) {
            return [1, "...", ...pageNumbers.slice(-maxPageNumbers + 1)];
        } else {
            const startPage = currentPage - middleIndex + 1;
            const endPage = currentPage + middleIndex - 1;
            return [1, "...", ...pageNumbers.slice(startPage, endPage), "...", totalNumberOfPages];
        }
    };

    return (
        <div className="row justify-content-between">
            <div className="col-md-3 col-sm-12 text-start">
                Showing 1 to {totalNumberOfPages} of {totalNumberOfPages} entries
            </div>
            <div className="col-md-3 col-sm-12 text-end">
                <div className="pagination">
                    <li className="page-item">
                        <button
                            className={"page-link " + (currentPage === 1 ? "disabled" : "")}
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            {"<"}
                        </button>
                    </li>
                    {renderPageNumbers().map((pageNumber, idx) => (
                        <li key={idx} className="page-item">
                            <button
                                className={`page-link ${currentPage === pageNumber ? "active" : ""}`}
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    ))}
                    <li className="page-item">
                        <button
                            className={
                                "page-link " + (currentPage === totalNumberOfPages ? "disabled" : "")
                            }
                            onClick={() => handlePageChange(totalNumberOfPages)}
                            disabled={currentPage === totalNumberOfPages}
                        >
                            {">"}
                        </button>
                    </li>
                </div>
            </div>
        </div>
    );
};

const Table = ({ headers, data, isLoading, loadingTag }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState(headers[0].column);
    const [sortDirection, setSortDirection] = useState("asc");

    // Filter data
    const filteredData = data.filter((item) =>
        headers.some((header) =>
            String(item[header.column]).toLowerCase().includes(searchValue.toLowerCase())
        )
    );

    const totalNumberOfPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSortColumnChange = (column) => {
        if (sortColumn === column) {
            setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    return (
        <TableWrapper>
            {/* The top controls */}
            <div className="row justify-content-between">
                <div className="col-md-3 col-sm-12 text-end">
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Search all columns"
                        />
                    </div>
                </div>
            </div>

            {/* The table */}
            <div className="table-responsive">
                <table className="table table-bordered table-responsive">
                    <TableHeader
                        headers={headers}
                        onSortColumnChange={handleSortColumnChange}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                    />
                    <TableBody
                        headers={headers}
                        data={filteredData}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        isLoading={isLoading}
                    />
                </table>
            </div>

            {/* Loading indicator */}
            {isLoading && (
                <div className="loading-center">
                    <p>{loadingTag}</p>
                </div>
            )}

            {/* Pagination controls */}
            <Pagination
                currentPage={currentPage}
                totalNumberOfPages={totalNumberOfPages}
                handlePageChange={handlePageChange}
            />
        </TableWrapper>
    );
};

export default Table;
