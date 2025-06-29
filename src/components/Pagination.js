import './css/Pagination.css';
import { FaAngleDoubleLeft } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, onPageChange }) {

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 9) {
        // Small number of pages, show all
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <FaAngleDoubleLeft />
        </button>

        {pageNumbers.map((page, index) =>
            page === '...' ? (
                <>
                    <span key={index} className="dots">.</span>
                    <span key={index} className="dots">.</span>
                    <span key={index} className="dots">.</span>
                </>
            ) : (
            <button
                key={index}
                onClick={() => onPageChange(page)}
                className={page === currentPage ? 'active' : ''}
            >
                {page}
            </button>
            )
        )}

        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            <FaAngleDoubleRight />
        </button>
    </div>
  );
}

export default Pagination;