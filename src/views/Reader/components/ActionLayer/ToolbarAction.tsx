import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import ToolbarColumn from '@/components/Toolbar/ToolbarColumn';
import ToolbarRow from '@/components/Toolbar/ToolbarRow';
import ToolbarRowSpace from '@/components/Toolbar/ToolbarRowSpace';
import useSetting from '@/hooks/useSetting';
import { TAppSetting } from '@/modules/setting';
import {
  BrightnessMediumRounded,
  DarkModeRounded,
  FullscreenExitRounded,
  FullscreenRounded,
  LightModeRounded,
  MenuRounded,
  SettingsRounded,
} from '@mui/icons-material';
import { FC, useCallback, useState } from 'react';

export type ToolbarActionProps = {
  onOpenNav: () => void;
  onToggleColorMode: (mode: TAppSetting['colorMode']) => void;
  onToggleFullscreen: (fullscreen: boolean) => void;
  onOpenSetting: () => void;
};

const ToolbarAction: FC<ToolbarActionProps> = ({
  onOpenNav,
  onToggleColorMode,
  onToggleFullscreen,
  onOpenSetting,
}) => {
  const [setting] = useSetting();
  const ColorIcon =
    setting.colorMode === 'system'
      ? BrightnessMediumRounded
      : setting.colorMode === 'dark'
      ? DarkModeRounded
      : LightModeRounded;
  const handleColorModeClick = useCallback(() => {
    onToggleColorMode(
      setting.colorMode === 'dark'
        ? 'light'
        : setting.colorMode === 'light'
        ? 'system'
        : 'dark',
    );
  }, [setting, onToggleColorMode]);

  const [fullscreen, setFullscreen] = useState(false);
  const FullscreenIcon = !fullscreen
    ? FullscreenRounded
    : FullscreenExitRounded;
  const handleFullscreenClick = useCallback(() => {
    setFullscreen(!fullscreen);
    onToggleFullscreen(!fullscreen);
  }, [setFullscreen, onToggleFullscreen, fullscreen]);
  return (
    <ToolbarColumn>
      <ToolbarRow>
        <StyledMuiIconButton onClick={onOpenNav}>
          <MenuRounded />
        </StyledMuiIconButton>
        <StyledMuiIconButton onClick={handleColorModeClick}>
          <ColorIcon />
        </StyledMuiIconButton>
        <StyledMuiIconButton onClick={handleFullscreenClick}>
          <FullscreenIcon />
        </StyledMuiIconButton>
        <ToolbarRowSpace />
        <StyledMuiIconButton onClick={onOpenSetting}>
          <SettingsRounded />
        </StyledMuiIconButton>
      </ToolbarRow>
    </ToolbarColumn>
  );
};

export default ToolbarAction;
