import styled from 'styled-components';

export const TableWrapper = styled.div`
  /* A wrapper around the entire table and controls */
  width: 100%;
  padding: 1rem;

  /* Row with space-between columns */
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem; /* if you want small gutters */
  }

  .row.justify-content-between {
    justify-content: space-between;
  }

  .col-md-3,
  .col-sm-12 {
    flex: 1 1 auto;
    margin: 0.5rem;
    min-width: 200px; /* adjust as needed */
  }

  /* Text alignment helpers */
  .text-start {
    text-align: left;
  }

  .text-end {
    text-align: right;
  }

  /* Input group styling */
  .input-group {
    display: flex;
    align-items: center;
  }

  .input-group-text {
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    padding: 0.5rem 0.75rem;
  }

  .form-control,
  .form-select {
    border: 1px solid #ced4da;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
  }

  /* The table itself */
  .table-responsive {
    margin-top: 1rem;
    overflow-x: auto; /* horizontal scroll if table is too wide */
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-bordered {
    border: 1px solid #dee2e6;
  }

  .table thead th {
    border-bottom: 2px solid #dee2e6;
    cursor: pointer;
    user-select: none;
    /* Add a bit of styling for the sort arrows */
    position: relative;
    padding-right: 1.5rem; /* space for arrow */
  }

  .table thead th span {
    position: absolute;
    right: 0.75rem;
  }

  .table th,
  .table td {
    text-align: left;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    vertical-align: middle;
  }

  .table tbody tr:hover {
    background-color: #f8f9fa; /* a slight highlight on hover */
  }

  /* Pagination */
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .page-item {
    margin: 0 2px;
  }

  .page-link {
    border: 1px solid #dee2e6;
    padding: 0.5rem 0.75rem;
    color: #007bff;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
  }

  .page-link:hover {
    background-color: #e9ecef;
  }

  .page-link.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
    cursor: default;
  }

  .page-link.disabled {
    pointer-events: none;
    opacity: 0.6;
  }

  /* Center the loading tag */
  .loading-center {
    text-align: center;
    margin: 0 auto;
    width: 200px;
  }
`;
