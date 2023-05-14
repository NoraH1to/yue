import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import { MenuOutlined } from '@mui/icons-material';
import { useContext } from 'react';
import { BookMgmtContext } from '../../context';

const ToolbarButtonToggleSidebar = () => {
  const { toggleOpenSidebar } = useContext(BookMgmtContext);
  return (
    <StyledMuiIconButton onClick={() => toggleOpenSidebar()}>
      <MenuOutlined />
    </StyledMuiIconButton>
  );
};

export default ToolbarButtonToggleSidebar;
