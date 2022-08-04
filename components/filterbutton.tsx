import { css } from 'twind/css';
import { useFilter } from '../hooks/useFilter';
import { tw } from 'twind';

type FilterButtonProps = {
  onClick: () => void;
};

function FilterButton({ onClick }: FilterButtonProps) {
  const style = css`
    width: 96px;
    height: 33px;

    position: relative;

    button {
      width: 100%;
      height: 100%;

      box-sizing: border-box;

      background: #ffffff;
      border: 2px solid rgba(28, 37, 65, 0.2);
      border-radius: 12px;

      font-style: normal;
      font-weight: 800;
      font-size: 14px;
      line-height: 19px;
      text-align: center;

      color: #1c2541;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    button:focus {
      outline: none;
    }

    .active {
      border-color: #1c2541;
    }

    div {
      position: absolute;
      top: -8px;
      right: -5px;

      width: 22px;
      height: 22px;

      background: #1c2541;
      border-radius: 12px;

      font-style: normal;
      font-weight: 800;
      font-size: 12px;
      line-height: 16px;

      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;

      color: #ffffff;
    }
  `;

  const { getFilterCountAll } = useFilter();
  const filterCount = getFilterCountAll();

  return (
    <div className={tw(style)} onClick={onClick}>
      <button className={filterCount !== 0 ? 'active' : undefined}>
        <span>
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.99989 8.5C6.30589 8.5 7.41789 9.335 7.82989 10.5H13.9999V12.5H7.82889C7.64571 13.0189 7.32338 13.4774 6.89716 13.8255C6.47093 14.1735 5.95722 14.3977 5.41218 14.4734C4.86715 14.5492 4.31178 14.4736 3.80679 14.255C3.30181 14.0364 2.86665 13.6831 2.54891 13.2339C2.23116 12.7846 2.04306 12.2566 2.00517 11.7076C1.96728 11.1587 2.08106 10.6099 2.33407 10.1212C2.58707 9.63253 2.96957 9.22284 3.43973 8.93692C3.90989 8.65099 4.44961 8.49985 4.99989 8.5ZM4.99989 10.5C4.73467 10.5 4.48032 10.6054 4.29278 10.7929C4.10525 10.9804 3.99989 11.2348 3.99989 11.5C3.99989 11.7652 4.10525 12.0196 4.29278 12.2071C4.48032 12.3946 4.73467 12.5 4.99989 12.5C5.26511 12.5 5.51946 12.3946 5.707 12.2071C5.89453 12.0196 5.99989 11.7652 5.99989 11.5C5.99989 11.2348 5.89453 10.9804 5.707 10.7929C5.51946 10.6054 5.26511 10.5 4.99989 10.5ZM10.9999 2.5C11.5499 2.50011 12.0892 2.65139 12.559 2.93732C13.0288 3.22325 13.411 3.63283 13.6637 4.12128C13.9165 4.60973 14.0301 5.15826 13.9922 5.70693C13.9542 6.25559 13.7662 6.78326 13.4486 7.23228C13.1311 7.6813 12.6962 8.03439 12.1915 8.25294C11.6868 8.4715 11.1318 8.54712 10.587 8.47153C10.0423 8.39595 9.52877 8.17207 9.10266 7.82437C8.67655 7.47667 8.35421 7.01852 8.17089 6.5H1.99989V4.5H8.16989C8.3769 3.91493 8.76021 3.40842 9.26704 3.05024C9.77386 2.69206 10.3793 2.49982 10.9999 2.5ZM10.9999 4.5C10.7347 4.5 10.4803 4.60536 10.2928 4.79289C10.1052 4.98043 9.99989 5.23478 9.99989 5.5C9.99989 5.76522 10.1052 6.01957 10.2928 6.20711C10.4803 6.39464 10.7347 6.5 10.9999 6.5C11.2651 6.5 11.5195 6.39464 11.707 6.20711C11.8945 6.01957 11.9999 5.76522 11.9999 5.5C11.9999 5.23478 11.8945 4.98043 11.707 4.79289C11.5195 4.60536 11.2651 4.5 10.9999 4.5Z"
              fill="#1C2541"
            />
          </svg>
        </span>
        <span>Filters</span>
      </button>
      {filterCount !== 0 && <div>{filterCount}</div>}
    </div>
  );
}

export default FilterButton;
