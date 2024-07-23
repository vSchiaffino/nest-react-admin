import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'react-feather';
import Pagination from '../../models/shared/pagination';

interface TableProps {
  columns: string[];
  orderColumns?: string[];
  pagination: Pagination;
  onChangePagination: Dispatch<SetStateAction<Pagination>>;
  total: number;
  children: ReactNode[];
}

export default function Table({
  onChangePagination,
  columns,
  pagination,
  total,
  children,
  orderColumns = [],
}: TableProps) {
  const chevronNotActiveClasses = 'text-slate-300';
  const chevronActiveClasses = 'hover:bg-slate-300 transition cursor-pointer';
  const { page, perPage, orderBy, orderDirection } = pagination;
  const maxPages = total / perPage;
  const start = (page - 1) * perPage + 1;
  const end = (start + children?.length || 0) - 1;
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              onClick={() => {
                if (orderBy == column) {
                  onChangePagination({
                    ...pagination,
                    orderDirection: orderDirection == 'ASC' ? 'DESC' : 'ASC',
                  });
                } else {
                  onChangePagination({ ...pagination, orderBy: column });
                }
              }}
              key={index}
              scope="col"
              className={
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ' +
                (orderColumns.includes(column)
                  ? ' hover:cursor-pointer hover:bg-slate-100 '
                  : '')
              }
            >
              <div className="flex items-center">
                {column}
                {column === orderBy &&
                  (orderDirection == 'DESC' ? (
                    <ChevronUp className="ml-2" />
                  ) : (
                    <ChevronDown className="ml-2" />
                  ))}
              </div>
            </th>
          ))}
          <th scope="col" className="relative px-6 py-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">{children}</tbody>
      <tfoot>
        <tr>
          <td colSpan={columns.length + 1} className="px-6 py-3 text-right ">
            <div className="flex justify-end items-center space-x-4">
              <span>
                Rows per page:
                <select
                  className="form-select input ml-5"
                  value={perPage}
                  onChange={(e) =>
                    onChangePagination({
                      ...pagination,
                      perPage: Number(e.target.value),
                    })
                  }
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </span>
              <span>
                {start}-{end} of {total}
              </span>
              <span className="flex items-center space-x-2">
                <ChevronLeft
                  onClick={() =>
                    onChangePagination({ ...pagination, page: page - 1 })
                  }
                  className={
                    ' rounded-full ' +
                    (page > 1 ? chevronActiveClasses : chevronNotActiveClasses)
                  }
                />
                <ChevronRight
                  onClick={() =>
                    onChangePagination({ ...pagination, page: page + 1 })
                  }
                  className={
                    ' rounded-full ' +
                    (page < maxPages
                      ? chevronActiveClasses
                      : chevronNotActiveClasses)
                  }
                />
              </span>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
