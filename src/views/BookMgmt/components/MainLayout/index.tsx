import Toolbar from '@/components/Toolbar';
import { Stack } from '@mui/material';
import { FC, ReactNode } from 'react';
import ContentWrapper from '../ContentWrapper';
import ToolbarWrapper from '../ToolbarWrapper';
import ToolbarWrapperFloat from '../ToolbarWrapper/ToolbarWrapperFloat';

export type MainLayoutProps = {
  ToolbarTop?: ReactNode;
  ToolbarBottom?: ReactNode;
  Content: ReactNode;
  floatToolbarTop?: boolean;
  floatToolbarBottom?: boolean;
};

const MainLayout: FC<MainLayoutProps> = (props) => {
  const TbWrapperTop = props.floatToolbarTop
    ? ToolbarWrapperFloat
    : ToolbarWrapper;
  const TbWrapperBottom = props.floatToolbarBottom
    ? ToolbarWrapperFloat
    : ToolbarWrapper;
  return (
    <Stack width={1} height={1} overflow="auto">
      {props.ToolbarTop && (
        <TbWrapperTop position="sticky" top={0} width={1}>
          <Toolbar
            elevation={0}
            variant={props.floatToolbarTop ? 'outlined' : 'elevation'}
            sx={props.floatToolbarTop ? undefined : { borderRadius: 0 }}>
            {props.ToolbarTop}
          </Toolbar>
        </TbWrapperTop>
      )}
      <ContentWrapper>{props.Content}</ContentWrapper>
      {props.ToolbarBottom && (
        <TbWrapperBottom position="sticky" bottom={0} width={1}>
          {props.ToolbarBottom}
        </TbWrapperBottom>
      )}
    </Stack>
  );
};

export default MainLayout;
