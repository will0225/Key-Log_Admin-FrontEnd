interface IPager {
    currentPage: number;
    totalPages: number;
    goToPage: (pageNumber: number) => void;
}


const Pager = (props: IPager) => {
    const { currentPage, totalPages, goToPage } = props;
    return (<>
        <div className="pagination-controls">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
                First
            </button>
            <button
                onClick={() => goToPage(Number(currentPage) - 1)}
                disabled={currentPage <= 1}
            >
                Prev
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => goToPage(Number(currentPage) + 1)}
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
            <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
            >
                Last
            </button>
        </div>
    </>)
}

export default Pager;