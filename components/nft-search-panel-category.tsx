import type { TabName } from 'components/modals/search-modal';
import { useFilter } from '../hooks/useFilter';
import { tw } from 'twind';
import { css } from 'twind/css';

interface NftSearchPanelCategoryProps {
  name: TabName;
}

const style = css`
  .count {
    position: relative;

    margin-left: 14px;

    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
  }

  .count::before {
    content: '';

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 22px;
    height: 34px;
    border-radius: 20px;

    background: rgba(76, 103, 244, 0.2);
  }
`;

export default function NftSearchPanelCategory({
  name,
}: NftSearchPanelCategoryProps) {
  const { getFilterCount } = useFilter();

  const filterCount = getFilterCount(name.toLowerCase());

  return (
    <p className={tw(style)}>
      {name}
      {filterCount !== 0 && <span className="count">{filterCount}</span>}
    </p>
  );
}
